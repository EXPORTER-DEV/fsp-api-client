import { IRecordEnriched } from './models/record-enriched.model';
import { RecordSourceEnum, RecordTypeEnum } from './models/record.model';

export interface IApiConfig {
    host: string;
    port?: string;
    username: string;
    password: string;

    logger?: IApiLogger;
}

export interface IApiResponse<T> {
    status: number;
    response: T;
}

export interface IApiError {
    isDuplicate?: boolean;
    isEnrichError?: boolean;
    isValidateError?: boolean;
    isParseFailedError?: boolean;
}

export class ApiError implements IApiError {
	isDuplicate?: boolean | undefined;
	constructor(data: IApiError) {
		Object.assign(this, data);
	}
}

export interface IApiLogger {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
}

export interface IFindRequest {
    type?: RecordTypeEnum;
    source?: RecordSourceEnum;
    entityId: string;
}

export interface IFindByIdRequest {
    id: number;
}

export interface IFindAllRequest {
    offset: number;
    limit: number;
    type?: RecordTypeEnum;
    source?: RecordSourceEnum;
}

export interface IFindAllResponse {
    offset: number;
    count: number;
    items: IRecordEnriched[];
}

export interface ICreateRequest<Entity> {
    entityId: string; 
    entity: Entity;
    type: RecordTypeEnum;
    source: RecordSourceEnum;
    description: string;
    creatorId: string;
}

export interface ICreateRequestVkGroupEntity {
    name: string;
}

export interface ICreateRequestVkUserEntity {
    first_name: string;
    last_name: string;
}

export type ICreateRequestOtherEntity = Record<string, unknown>

export interface IEditRequest {
    id: number;
    updatorId: string;
    description: string;
    source: RecordSourceEnum;
}