/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { summaly } from '@misskey-dev/summaly';
import { SummalyResult } from '@misskey-dev/summaly/built/summary.js';
import { DI } from '@/di-symbols.js';
import type { Config } from '@/config.js';
import { HttpRequestService } from '@/core/HttpRequestService.js';
import type Logger from '@/logger.js';
import { query } from '@/misc/prelude/url.js';
import { LoggerService } from '@/core/LoggerService.js';
import { bindThis } from '@/decorators.js';
import { ApiError } from '@/server/api/error.js';
import { MiMeta } from '@/models/Meta.js';
import type { FastifyRequest, FastifyReply } from 'fastify';
import { fetchJson } from "@/misc/fetchJson.js";

@Injectable()
export class UrlPreviewService {
	private logger: Logger;

	constructor(
		@Inject(DI.config)
		private config: Config,

		@Inject(DI.meta)
		private meta: MiMeta,

		private httpRequestService: HttpRequestService,
		private loggerService: LoggerService,
	) {
		this.logger = this.loggerService.getLogger('url-preview');
	}

	@bindThis
	private wrap(url?: string | null): string | null {
		return url != null
			? url.match(/^https?:\/\//)
				? `${this.config.mediaProxy}/preview.webp?${query({
					url,
					preview: '1',
				})}`
				: url
			: null;
	}

	@bindThis
	public async handle(
		request: FastifyRequest<{ Querystring: { url: string; lang?: string; } }>,
		reply: FastifyReply,
	): Promise<object | undefined> {
		const url = request.query.url;
		if (typeof url !== 'string') {
			reply.code(400);
			return;
		}

		const lang = request.query.lang;
		if (Array.isArray(lang)) {
			reply.code(400);
			return;
		}

		if (!this.meta.urlPreviewEnabled) {
			reply.code(403);
			return {
				error: new ApiError({
					message: 'URL preview is disabled',
					code: 'URL_PREVIEW_DISABLED',
					id: '58b36e13-d2f5-0323-b0c6-76aa9dabefb8',
				}),
			};
		}

		this.logger.info(this.meta.urlPreviewSummaryProxyUrl
			? `(Proxy) Getting preview of ${url}@${lang} ...`
			: `Getting preview of ${url}@${lang} ...`);

		// SteamのApp IDを取得
		const steamAppId = this.isSteamUrl(url);
		if (steamAppId) {
			// Steamの場合の処理
			try {
				const steamApiUrl = `https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=jp&l=${lang ?? 'ja'}`;
				// getJsonを使用してSteamデータを取得
				const data: any = await fetchJson(steamApiUrl);
				const appData = data[steamAppId]?.data;
				if (appData && data[steamAppId].success) {
					// summaryオブジェクトを構築
					const summary = {
						url: url,
						title: appData.name,
						description: '', // 後で設定
						thumbnail: appData.header_image,
						icon: 'https://store.steampowered.com/favicon.ico',
						sitename: 'Steam',
						player: null,
						// 追加のSteam専用データ
						steam: {
							ageLimit: appData.required_age && appData.required_age !== '0' ? appData.required_age : null,
							developer: appData.developers ? appData.developers.join(', ') : '',
							onSale: appData.price_overview ? appData.price_overview.discount_percent > 0 : false,
							discountPercent: appData.price_overview ? appData.price_overview.discount_percent : 0,
							originalPrice: appData.price_overview ? appData.price_overview.initial_formatted : null,
							currentPrice: appData.price_overview ? appData.price_overview.final_formatted : null,
							description: appData.detailed_description ? appData.detailed_description : "No Desc",
							isFree: appData.is_free,
						},
					};
					// 開発者情報を説明に設定
					summary.description = summary.steam.developer;
					// サムネイルとアイコンをラップ
					summary.icon = this.wrap(summary.icon) ?? "";
					summary.thumbnail = this.wrap(summary.thumbnail);
					// Cache 7days
					reply.header("Cache-Control", "max-age=604800, immutable");
					return summary;
				} else {
					throw new Error('Failed to get Steam app data');
				}
			} catch (err) {
				this.logger.warn(`Failed to get Steam data for ${url}: ${err}`);
				reply.code(200);
				reply.header("Cache-Control", "max-age=86400, immutable");
				return new Error('unsupported schema included');
			}
		}

		try {
			const summary = this.meta.urlPreviewSummaryProxyUrl
				? await this.fetchSummaryFromProxy(url, this.meta, lang)
				: await this.fetchSummary(url, this.meta, lang);

			this.logger.succ(`Got preview of ${url}: ${summary.title}`);

			if (!(summary.url.startsWith('http://') || summary.url.startsWith('https://'))) {
				throw new Error('unsupported schema included');
			}

			if (summary.player.url && !(summary.player.url.startsWith('http://') || summary.player.url.startsWith('https://'))) {
				throw new Error('unsupported schema included');
			}

			summary.icon = this.wrap(summary.icon);
			summary.thumbnail = this.wrap(summary.thumbnail);

			// Cache 7days
			reply.header('Cache-Control', 'max-age=604800, immutable');

			return summary;
		} catch (err) {
			this.logger.warn(`Failed to get preview of ${url}: ${err}`);

			reply.code(422);
			reply.header('Cache-Control', 'max-age=86400, immutable');
			return {
				error: new ApiError({
					message: 'Failed to get preview',
					code: 'URL_PREVIEW_FAILED',
					id: '09d01cb5-53b9-4856-82e5-38a50c290a3b',
				}),
			};
		}
	}


	// SteamのURLを判定し、App IDを取得する関数
	private isSteamUrl(url: string): string | null {
		try {
			const parsedUrl = new URL(url);
			if (
				parsedUrl.hostname === "store.steampowered.com" ||
				parsedUrl.hostname.endsWith(".steampowered.com")
			) {
				const pathSegments = parsedUrl.pathname.split("/");
				const appIndex = pathSegments.indexOf("app");
				if (appIndex !== -1 && pathSegments.length > appIndex + 1) {
					return pathSegments[appIndex + 1];
				}
			}
			return null;
		} catch (error: any) {
			this.logger.warn("Invalid URL:", error);
			return null;
		}
	}

	private fetchSummary(url: string, meta: MiMeta, lang?: string): Promise<SummalyResult> {
		const agent = this.config.proxy
			? {
				http: this.httpRequestService.httpAgent,
				https: this.httpRequestService.httpsAgent,
			}
			: undefined;

		return summaly(url, {
			followRedirects: false,
			lang: lang ?? 'ja-JP',
			agent: agent,
			userAgent: meta.urlPreviewUserAgent ?? undefined,
			operationTimeout: meta.urlPreviewTimeout,
			contentLengthLimit: meta.urlPreviewMaximumContentLength,
			contentLengthRequired: meta.urlPreviewRequireContentLength,
		});
	}

	private fetchSummaryFromProxy(url: string, meta: MiMeta, lang?: string): Promise<SummalyResult> {
		const proxy = meta.urlPreviewSummaryProxyUrl!;
		const queryStr = query({
			url: url,
			lang: lang ?? 'ja-JP',
			userAgent: meta.urlPreviewUserAgent ?? undefined,
			operationTimeout: meta.urlPreviewTimeout,
			contentLengthLimit: meta.urlPreviewMaximumContentLength,
			contentLengthRequired: meta.urlPreviewRequireContentLength,
		});

		return this.httpRequestService.getJson<SummalyResult>(`${proxy}?${queryStr}`, 'application/json, */*', undefined, true);
	}
}
