import { IEntity } from './models/entity.model';
import { IRecordEnriched } from './models/record-enriched.model';
import { RecordSourceEnum, RecordTypeEnum } from './models/record.model';

export interface IApiConfig {
    host: string;
    port?: string | number;
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
	isAuthorizationError?: boolean;
	isInternalError?: boolean;
}

export class ApiError implements IApiError {
	isDuplicate?: boolean | undefined;
	isEnrichError?: boolean;
	isValidateError?: boolean;
	isParseFailedError?: boolean;
	isAuthorizationError?: boolean;
	isInternalError?: boolean;

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

export interface ICreateRequest<Entity, Type> {
    entityId: string; 
    entity: Entity;
    type: Type;
    source: RecordSourceEnum;
    description: string;
    creatorId: string;
}

export interface IEditRequest {
    id: number;
    source: RecordSourceEnum;
    description: string;
    updatorId: string;
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

export interface IDeleteRequest {
    id: number;
    deletedId: string;
    source: RecordSourceEnum;
}

export interface IResolvedEntity {
	id: string;
	type: RecordTypeEnum;
    resolvedEntity: IEntity;
	sourceEntity: Record<string, string>;
}