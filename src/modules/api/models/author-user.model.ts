import { RecordSourceEnum } from './record.model';

export interface IAuthorUser {
	displayName: string;
	id: string;
	link: string;
	source: RecordSourceEnum;
	timestamp: number;
}