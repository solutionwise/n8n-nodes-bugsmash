import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BugSmashApi implements ICredentialType {
	name = 'bugSmashApi';

	displayName = 'BugSmash API';

	icon: Icon = 'file:bugsmash.svg';

	documentationUrl = 'https://api.bugsmash.io/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.bugsmash.io/',
			description: 'The base URL of the BugSmash API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				api_key: '={{$credentials?.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.baseUrl}}',
			url: '/api/v2/n8n/user',
			method: 'GET',
		},
	};
}
