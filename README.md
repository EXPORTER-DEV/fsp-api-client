# fsp-api-client

API client package for personal project infrastructure

### Usage example

> Install first

```bash
$ npm i https://github.com/EXPORTER-DEV/fsp-api-client
```

> Then construct ApiModule with credentials to make API calls

```typescript
import { ApiModule } from 'fsp-api-client';
import { RecordSourceEnum } from 'fsp-api-client/lib/modules/api/models/record.model';


const api = new ApiModule({
	host: 'localhost',
	port: 3000,
	username: 'test',
	password: 'test',
});

api.resolveAndCreate('https://google.com/', {
	creatorId: '1a2b3c',
	source: RecordSourceEnum.external,
	description: '-',
}).then((r) => console.log(r));
```