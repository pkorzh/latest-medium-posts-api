import request from 'request-promise-native';
import { ok_response } from '../../src/response';

const USERNAME = 'platon_korzh';

export function handler(event, context, callback) {
	request(`https://medium.com/@${USERNAME}/latest?format=json`).then((response) => {

		response = response.replace('])}while(1);</x>', '');

		const json = JSON.parse(response);

		const latest = Object.keys(json.payload.references.Post).map(postId => {
			const post = json.payload.references.Post[postId];

			return {
				title: post.title,
				subtitle: post.content.subtitle
			};
		});

		callback(null, ok_response(latest));
	}, (error) => {
		callback(error, null);
	});
};