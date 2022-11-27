import { RecordTypeEnum } from './record.model';

export interface IEntity {
    id: string;
    displayName: string;
    link: string;
    type: RecordTypeEnum;
}