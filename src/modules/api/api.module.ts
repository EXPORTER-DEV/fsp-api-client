import { ApiError, IApiConfig, IApiLogger, IApiResponse, ICreateRequest, ICreateRequestOtherEntity, ICreateRequestVkGroupEntity, ICreateRequestVkUserEntity, IEditRequest, IFindAllRequest, IFindAllResponse, IFindByIdRequest, IFindRequest } from './api.interface';
import { Axios, Method, AxiosRequestConfig } from 'axios';
import { IRecordEnriched } from './models/record-enriched.model';
import { RecordTypeEnum } from './models/record.model';

export class ApiModule {
	private client: Axios;
	private logger: IApiLogger;
	constructor(config: IApiConfig) {
		this.client = new Axios({
			baseURL: `http://${config.host}${config.port ? `:${config.port}` : ''}`,
			auth: {
				username: config.username,
				password: config.password,
			},
			headers: {
				'user-agent': `fsp-api-client v${process.env.npm_package_version}`,
				'content-type': 'application/json',
			},
			validateStatus: () => true,
		});

		if (config.logger) {
			this.logger = config.logger;
		} else {
			this.logger = console;
		}
	}

	private async buildConfig(method: Method, path: string, payload: Record<string, unknown>): Promise<AxiosRequestConfig> {
		const config: AxiosRequestConfig = {
			url: path,
			method,
		};
		if (method.toLowerCase() === 'get') {
			config.params = payload;
		} else {
			config.data = JSON.stringify(payload);
		}

		return config;
	}

	private async request<T>(method: Method, path: string, payload: Record<string, unknown>): Promise<IApiResponse<T>> {
		const config = await this.buildConfig(method, path, payload);
		const result = await this.client.request(config);

		const { status, data, request } = result;

		const logRequest = {
			url: `${request.protocol}//${request.host}${request.path}`,
			method: request.method,
			headers: request._header?.split(/\r\n/gi)?.slice(1)?.filter((header: any) => header?.length > 0),
		};

		const logData = { status, data, payload, logRequest };

		let parsedData: T;
		try {
			parsedData = data ? JSON.parse(data) : undefined;
		} catch (err) {
			this.logger.error('Got parse response error', logData);
			throw new ApiError({isParseFailedError: true});
		}

		if (status === 400) {
			this.logger.error('Got validation error', logData);
			throw new ApiError({isValidateError: true});
		}

		if (status === 401) {
			this.logger.error('Got authorization error', logData);
			throw new ApiError({isAuthorizationError: true});
		}

		if (status === 406) {
			this.logger.error('Got duplicate error', logData);
			throw new ApiError({isDuplicate: true});
		}

		if (status === 500) {
			this.logger.error('Got internal error', logData);
			throw new ApiError({isInternalError: true});
		}

		if (status === 503) {
			this.logger.error('Got enrich error', logData);
			throw new ApiError({isEnrichError: true});
		}

		return {
			status,
			response: parsedData as T,
		};
	}

	async find(request: IFindRequest): Promise<IRecordEnriched | undefined> {
		const { response, status } = await this.request<IRecordEnriched[]>('GET', 'record/enriched', request as Record<any, any>);

		if (status === 404) return undefined;
		if (status !== 200) this.logger.error('find', 'Got strange status', { status, response });
		if (response.length === 0 || status !== 200) return undefined;
		return response[0];
	}

	async findById(request: IFindByIdRequest): Promise<IRecordEnriched | undefined> {
		const { response, status } = await this.request<IRecordEnriched>('GET', 'record/findById/enriched', request as Record<any, any>);

		if (status === 404) return undefined;
		if (status !== 200) {
			this.logger.error('findById', 'Got strange status', { status, response });
			return undefined;
		}

		return response;
	}

	async findAll(request: IFindAllRequest): Promise<IFindAllResponse> {
		const { response, status } = await this.request<IFindAllResponse>('GET', 'record/all/enriched', request as Record<any, any>);

		if (status !== 200) {
			this.logger.error('findAll', 'Got strange status', { status, response });
			return {
				items: [],
				count: 0,
				offset: request.offset,
			};
		}

		return response;
	}

	async create(
		request: ICreateRequest<ICreateRequestVkUserEntity, RecordTypeEnum.user>
			| ICreateRequest<ICreateRequestVkGroupEntity, RecordTypeEnum.group>
			| ICreateRequest<ICreateRequestOtherEntity, Exclude<RecordTypeEnum, RecordTypeEnum.group | RecordTypeEnum.user>>
	): Promise<IRecordEnriched | undefined> {
		const { response, status } = await this.request<IRecordEnriched>('POST', 'record/enriched', request as Record<any, any>);

		if (status !== 201) {
			this.logger.error('create', 'Got strange status', { status, response });
			return undefined;
		}

		return response;
	}

	async edit(request: IEditRequest): Promise<IRecordEnriched | undefined> {
		const { response, status } = await this.request<IRecordEnriched>('PATCH', 'record/enriched', request as Record<any, any>);

		if (status === 404) return undefined;

		return response;
	}
}