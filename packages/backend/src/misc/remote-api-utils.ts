/*
 * SPDX-FileCopyrightText: syuilo and misskey-project, yojo-art team
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Redis from 'ioredis';
import got from 'got';
import type { Config } from '@/config.js';
import { HttpRequestService } from '@/core/HttpRequestService.js';
import { MiUser } from '@/models/User.js';

const timeout = 30 * 1000;
const operationTimeout = 60 * 1000;
const _timeout = {
	lookup: timeout,
	connect: timeout,
	secureConnect: timeout,
	socket: timeout,	// read timeout
	response: timeout,
	send: timeout,
	request: operationTimeout,	// whole operation timeout
};

export type FetchRemoteApiOpts={
	/** リモートで割り当てられているid */
	userId?:string,
	limit?:number,
	sinceId?:string,
	untilId?:string,
};

export async function emojis(
	config: Config,
	httpRequestService: HttpRequestService,
	redisForRemoteApis: Redis.Redis,
	host: string,
	text:string,
):Promise<{[k: string]: string}> {
	const emojis = new Map<string, string>();
	const remote_emojis = await fetch_remote_emojis(config, httpRequestService, redisForRemoteApis, host);
	remote_emojis.forEach((value, key) => text.indexOf(`:${key}:`) !== -1 && emojis.set(key, value));
	return Object.fromEntries(emojis);
}

export async function fetch_remote_emojis(
	config: Config,
	httpRequestService: HttpRequestService,
	redisForRemoteApis: Redis.Redis,
	host: string,
):Promise<Map<string, string>> {
	const cache_key = `emojis:${host}`;
	const cache_value = await redisForRemoteApis.get(cache_key);
	if (cache_value) {
		if (cache_value.startsWith('__')) return new Map();
		return new Map(Object.entries(JSON.parse(cache_value)));
	}
	const res = got.get(`https://${host}/api/emojis`, {
		headers: {
			'User-Agent': config.userAgent,
		},
		timeout: _timeout,
		agent: {
			http: httpRequestService.httpAgent,
			https: httpRequestService.httpsAgent,
		},
		http2: true,
		retry: {
			limit: 2,
		},
		enableUnixSockets: false,
	});

	const array = JSON.parse(await res.text())?.emojis;
	const parsed = new Map<string, string>(
		Array.isArray(array)
			? array.map(entry => [entry.name, entry.url])
			: [],
	);
	const redisPipeline = redisForRemoteApis.pipeline();
	await redisPipeline.set(cache_key, JSON.stringify(Object.fromEntries(parsed)), 'EX', 60 * 60).exec();
	return parsed;
}

export async function fetch_remote_api(
	config: Config, httpRequestService: HttpRequestService, host: string, endpoint: string, opts: FetchRemoteApiOpts,
) {
	const res = got.post(`https://${host}${endpoint}`, {
		headers: {
			'User-Agent': config.userAgent,
			'Content-Type': 'application/json; charset=utf-8',
		},
		timeout: _timeout,
		agent: {
			http: httpRequestService.httpAgent,
			https: httpRequestService.httpsAgent,
		},
		http2: true,
		retry: {
			limit: 1,
		},
		enableUnixSockets: false,
		body: JSON.stringify({
			userId: opts.userId,
			limit: opts.limit,
			sinceId: opts.sinceId ? opts.sinceId.split('@')[0] : undefined,
			untilId: opts.untilId ? opts.untilId.split('@')[0] : undefined,
		}),
	});
	return await res.text();
}
/** userがリモートで割り当てられているidを取得 */
export async function fetch_remote_user_id(
	config:Config,
	httpRequestService: HttpRequestService,
	redisForRemoteApis: Redis.Redis,
	user:MiUser,
) {
	const redisPipeline = redisForRemoteApis.pipeline();
	//ローカルのIDからリモートのIDを割り出す
	const cache_key = `remote-userId:${user.id}`;
	const id = await redisForRemoteApis.get(cache_key);
	if (id !== null) {
		if (id === '__NOT_MISSKEY' || id === '__INTERVAL') {
			return null;
		}
		//アクセス時に有効期限を更新
		redisForRemoteApis.expire(cache_key, 7 * 24 * 60 * 60);
		return id;
	}
	try {
		const url = `https://${user.host}/api/users/show`;
		const res = got.post(url, {
			headers: {
				'User-Agent': config.userAgent,
				'Content-Type': 'application/json; charset=utf-8',
			},
			timeout: _timeout,
			agent: {
				http: httpRequestService.httpAgent,
				https: httpRequestService.httpsAgent,
			},
			http2: true,
			retry: {
				limit: 1,
			},
			enableUnixSockets: false,
			body: JSON.stringify({
				username: user.username,
			}),
		});
		const json = JSON.parse(await res.text());
		if (json.id != null) {
			await redisPipeline.set(cache_key, json.id, 'EX', 7 * 24 * 60 * 60).exec();
			return json.id as string;
		}
	} catch {
		await redisPipeline.set(cache_key, '__INTERVAL', 'EX', 7 * 24 * 60 * 60).exec();
	}
	return null;
}
