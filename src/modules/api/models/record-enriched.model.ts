import { IAuthorUser } from './author-user.model';
import { IEntity } from './entity.model';
import { RecordSourceEnum, RecordTypeEnum } from './record.model';

export interface IRecordEnriched {
	createdBy: IAuthorUser;
	deletedBy?: IAuthorUser;
	updatedBy?:IAuthorUser;
	id: number;
	entity: IEntity;
	type: RecordTypeEnum;
	source: RecordSourceEnum;
	description: string;
	photos: string[];
}
