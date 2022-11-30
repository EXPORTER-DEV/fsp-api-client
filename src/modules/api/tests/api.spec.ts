import nock from 'nock';
import { ApiError, IApiConfig } from '../api.interface';
import { ApiModule } from '../api.module';
import fs from 'fs';
import JSON5 from 'json5';
import { RecordSourceEnum, RecordTypeEnum } from '../models/record.model';

const config: IApiConfig = {
	host: 'localhost',
	username: 'test',
	password: 'test',
};

describe('ApiModule', () => {
	let api: ApiModule;

	beforeEach(() => {
		api = new ApiModule(config);
		nock.cleanAll();
	});

	it('Test find', async () => {
		const data = JSON5.parse(fs.readFileSync(`${__dirname}/data/find-1.json5`, 'utf-8'));

		nock(`http://${config.host}`)
			.get('/record/enriched?entityId=test')
			.reply(200, data);
        
		const result = await api.find({entityId: 'test'});

		expect(result).not.toBeUndefined();
	});

	it('Test find [503]', async () => {
		nock(`http://${config.host}`)
			.get('/record/enriched?entityId=test')
			.reply(503);
        
		expect(api.find({entityId: 'test'})).rejects.toEqual(new ApiError({isEnrichError: true}));
	});

	it('Test findById', async () => {
		const data = JSON5.parse(fs.readFileSync(`${__dirname}/data/findById-1.json5`, 'utf-8'));

		nock(`http://${config.host}`)
			.get('/record/findById/enriched?id=1')
			.reply(200, data);
        
		const result = await api.findById({id: 1});

		expect(result).not.toBeUndefined();
	});

	it('Test findById [404]', async () => {
		nock(`http://${config.host}`)
			.get('/record/findById/enriched?id=1')
			.reply(404);
        
		const result = await api.findById({id: 1});

		expect(result).toBeUndefined();
	});

	it('Test findAll', async () => {
		const data = JSON5.parse(fs.readFileSync(`${__dirname}/data/findAll-1.json5`, 'utf-8'));

		nock(`http://${config.host}`)
			.get('/record/all/enriched?offset=0&limit=10')
			.reply(200, data);
        
		const result = await api.findAll({offset: 0, limit: 10});

		expect(result).not.toBeUndefined();
		expect(result.items).toHaveLength(10);
	});

	it('Test findAll [400]', async () => {
		const data = JSON5.parse(fs.readFileSync(`${__dirname}/data/findAll-2.json5`, 'utf-8'));

		nock(`http://${config.host}`)
			.get('/record/all/enriched?offset=0&limit=10')
			.reply(400, data);
        
		expect(api.findAll({offset: 0, limit: 10})).rejects.toEqual(new ApiError({isValidateError: true}));
	});

	it('Test create VK user', async () => {
		const data = JSON5.parse(fs.readFileSync(`${__dirname}/data/create-1.json5`, 'utf-8'));

		nock(`http://${config.host}`)
			.post('/record/enriched')
			.reply(201, data);

		const result = await api.create({
			entityId: 'test',
			type: RecordTypeEnum.user,
			source: RecordSourceEnum.telegram,
			creatorId: '1',
			description: '',
			entity: {
				first_name: 'test',
				last_name: 'test',
			}
		});
        
		expect(result).toStrictEqual({
			id: 1682,
			type: 'user',
			source: 'telegram',
			description: '',
			entity: {
				type: 'user',
				displayName: 'test test',
				link: 'https://vk.com/test',
				id: 'test'
			}
		});
	});

	it('Test create Telegram entity [406]', async () => {
		nock(`http://${config.host}`)
			.post('/record/enriched')
			.reply(406);

		expect(api.create({
			entityId: 'test',
			type: RecordTypeEnum.telegram,
			source: RecordSourceEnum.telegram,
			creatorId: '1',
			description: '',
			entity: {
				first_name: 'test',
				last_name: 'test',
			}
		})).rejects.toEqual(new ApiError({isDuplicate: true}));
	});

	it('Test edit entity', async () => {
		const data = JSON5.parse(fs.readFileSync(`${__dirname}/data/edit-1.json5`, 'utf-8'));

		nock(`http://${config.host}`)
			.patch('/record/enriched')
			.reply(200, data);

		const result = await api.edit({
			id: 1682,
			updatorId: '1',
			description: 'test',
			source: RecordSourceEnum.telegram,
		});

		expect(result?.description).toStrictEqual('test');
		expect(result?.updatedBy?.id).toStrictEqual('1');
	});
});