import type {
	IWebhookFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
	INodePropertyOptions,
	IHttpRequestOptions,
} from 'n8n-workflow';

export class BugSmashTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BugSmash Trigger',
		name: 'bugSmashTrigger',
		icon: 'file:bugsmash.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Starts the workflow when BugSmash events occur',
		defaults: {
			name: 'BugSmash Trigger',
		},
		usableAsTool: true,
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'bugSmashApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Comment Replied',
						value: 'comment_replied',
						description: 'Triggers when a reply is added to a comment',
					},
					{
						name: 'Comment Updated',
						value: 'comment_update',
						description: 'Triggers when a comment is updated',
					},
					{
						name: 'New Comment',
						value: 'new_comment',
						description: 'Triggers when a new comment is created',
					},
					// {
					// 	name: 'Priority Changed',
					// 	value: 'priority_changed',
					// 	description: 'Triggers when a comment priority changes',
					// },
					{
						name: 'Status Changed',
						value: 'status_changed',
						description: 'Triggers when a comment status changes',
					},
				],
				default: 'new_comment',
				required: true,
			},
			{
				displayName: 'Project Name or ID',
				name: 'projectId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getProjects',
				},
				default: '',
				description:
					'Optionally filter by project. Leave empty to receive events for all projects. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	};

	methods = {
		loadOptions: {
			async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('bugSmashApi');
				const baseUrl = credentials.baseUrl as string;

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'bugSmashApi', {
					method: 'GET',
					url: `${baseUrl}/api/v2/n8n/projects`,
				} as IHttpRequestOptions);

				const projects = response.data || response;
				if (!Array.isArray(projects)) {
					return [{ name: 'All Projects', value: '' }];
				}

				const options: INodePropertyOptions[] = [{ name: 'All Projects', value: '' }];
				for (const project of projects) {
					options.push({
						name: project.name || project.title || `Project ${project.id}`,
						value: String(project.id),
					});
				}

				return options;
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;
				const projectId = this.getNodeParameter('projectId', '') as string;
				const credentials = await this.getCredentials('bugSmashApi');
				const baseUrl = credentials.baseUrl as string;

				const body: IDataObject = {
					webhook_url: webhookUrl,
					event,
				};

				if (projectId) {
					body.project_id = projectId;
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'bugSmashApi', {
					method: 'POST',
					url: `${baseUrl}/api/v2/n8n/subscribe`,
					body,
				} as IHttpRequestOptions);

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = response?.subscription?.id || response?.id;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const credentials = await this.getCredentials('bugSmashApi');
				const baseUrl = credentials.baseUrl as string;

				const webhookData = this.getWorkflowStaticData('node');
				const webhookId = webhookData.webhookId;

				if (webhookId) {
					try {
						await this.helpers.httpRequestWithAuthentication.call(this, 'bugSmashApi', {
							method: 'DELETE',
							url: `${baseUrl}/api/v2/n8n/unsubscribe`,
							body: { subscription_id: webhookId },
						} as IHttpRequestOptions);
					} catch {
						// Subscription may already be deleted remotely.
					}
				}

				delete webhookData.webhookId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;

		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
