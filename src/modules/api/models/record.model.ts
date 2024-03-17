export enum RecordTypeEnum {
    user = 'user',
    group = 'group',
    external = 'external',
    instagram = 'instagram',
    telegram = 'telegram',
}

export enum RecordSourceEnum {
    vk = 'vk',
    telegram = 'telegram',
}

export interface IRecord {
    id: number;
    entityId: string;
    entity: Record<string, any>;
    type: RecordTypeEnum;
    source: RecordSourceEnum;
    description: string;
    createdAt: number;
    creatorId: string;
    createdSource: RecordSourceEnum;
    updatedAt: number;
    updatedBy?: string;
    updatedSource?: RecordSourceEnum;
    deletedDate?: Date;
    deletedAt?: number;
    deletedBy?: string;
    deletedSource?: RecordSourceEnum;
    photos: string[];
}
