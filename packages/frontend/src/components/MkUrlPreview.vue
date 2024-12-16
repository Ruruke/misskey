<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<template v-if="player.url && playerEnabled">
	<div
		:class="$style.player"
		:style="player.width ? `padding: ${(player.height || 0) / player.width * 100}% 0 0` : `padding: ${(player.height || 0)}px 0 0`"
	>
		<iframe
			v-if="player.url.startsWith('http://') || player.url.startsWith('https://')"
			sandbox="allow-popups allow-scripts allow-storage-access-by-user-activation allow-same-origin"
			scrolling="no"
			:allow="player.allow == null ? 'autoplay;encrypted-media;fullscreen' : player.allow.filter(x => ['autoplay', 'clipboard-write', 'fullscreen', 'encrypted-media', 'picture-in-picture', 'web-share'].includes(x)).join(';')"
			:class="$style.playerIframe"
			:src="transformPlayerUrl(player.url)"
			:style="{ border: 0 }"
		></iframe>
		<span v-else>invalid url</span>
	</div>
	<div :class="$style.action">
		<MkButton :small="true" inline @click="playerEnabled = false">
			<i class="ti ti-x"></i> {{ i18n.ts.disablePlayer }}
		</MkButton>
	</div>
</template>
<div
	v-else-if="isSteam"
	class="steam-preview"
	@click.stop
>
	<div class="steam-row steam-header">
		<img :src="icon || defaultIcon" class="favicon" />
		<span class="steam-game-name">
			<span v-if="steamAgeLimit">[{{ steamAgeLimit }}+] </span>{{ steamGameName }}
			</span>
	</div>
	<div v-if="steamDeveloper" class="steam-row steam-developer">
		{{ steamDeveloper }}
	</div>
	<div class="steam-row steam-pricing">
			<span v-if="steamOnSale" class="steam-discount">
			-{{ Math.floor(steamDiscount * 10) / 10 }}%
			</span>
		<span v-if="steamOnSale" class="steam-original-price">
			{{ steamOriginalPrice }}
			</span>
		<span class="steam-current-price">
			{{ steamCurrentPrice }}
			</span>
	</div>
</div>
<template v-else-if="tweetId && postExpanded">
	<div>
		<iframe
			allow="fullscreen;web-share"
			sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
			scrolling="no"
			:style="{ position: 'relative', width: '100%', height: `${postHeight}px`, border: 0 }"
			:src="`https://platform.twitter.com/embed/index.html?embedId=${embedId}&amp;hideCard=false&amp;hideThread=false&amp;lang=en&amp;theme=${defaultStore.state.darkMode ? 'dark' : 'light'}&amp;id=${tweetId}`"
		></iframe>
	</div>
	<div :class="$style.action">
		<MkButton :small="true" inline @click="postExpanded = false">
			<i class="ti ti-x"></i> {{ i18n.ts.close }}
		</MkButton>
	</div>
</template>
<template v-else-if="bskyDid && bskyPostRecordKey && postExpanded">
	<div>
		<iframe
			allow="fullscreen;web-share"
			sandbox="allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
			scrolling="no"
			:style="{ position: 'relative', width: '100%', height: `${postHeight}px`, border: 0 }"
			:src="`https://embed.bsky.app/embed/${bskyDid}/app.bsky.feed.post/${bskyPostRecordKey}?id=${embedId}`"
		></iframe>
	</div>
	<div :class="$style.action">
		<MkButton :small="true" inline @click="postExpanded = false">
			<i class="ti ti-x"></i> {{ i18n.ts.close }}
		</MkButton>
	</div>
</template>
<div v-else>
	<component :is="self ? 'MkA' : 'a'" :class="[$style.link, { [$style.compact]: compact }]" :[attr]="self ? url.substring(local.length) : url" rel="nofollow noopener" :target="target" :title="url">
		<div v-if="thumbnail && !sensitive" :class="$style.thumbnail" :style="defaultStore.state.dataSaver.urlPreview ? '' : `background-image: url('${thumbnail}')`">
		</div>
		<article :class="$style.body">
			<header :class="$style.header">
				<h1 v-if="unknownUrl" :class="$style.title">{{ url }}</h1>
				<h1 v-else-if="fetching" :class="$style.title"><MkEllipsis/></h1>
				<h1 v-else :class="$style.title" :title="title ?? undefined">{{ title }}</h1>
			</header>
			<p v-if="unknownUrl" :class="$style.text">{{ i18n.ts.failedToPreviewUrl }}</p>
			<p v-else-if="fetching" :class="$style.text"><MkEllipsis/></p>
			<p v-else-if="description" :class="$style.text" :title="description">{{ description.length > 85 ? description.slice(0, 85) + '…' : description }}</p>
			<footer :class="$style.footer">
				<img v-if="icon" :class="$style.siteIcon" :src="icon"/>
				<p v-if="unknownUrl" :class="$style.siteName">{{ requestUrl.host }}</p>
				<p v-else-if="fetching" :class="$style.siteName"><MkEllipsis/></p>
				<p v-else :class="$style.siteName" :title="sitename ?? requestUrl.host">{{ sitename ?? requestUrl.host }}</p>
			</footer>
		</article>
	</component>
	<template v-if="showActions">
		<div v-if="tweetId" :class="$style.action">
			<MkButton :small="true" inline @click="postExpanded = true">
				<i class="ti ti-brand-x"></i> {{ i18n.ts.expandPost }}
			</MkButton>
		</div>
		<div v-if="bskyPostRecordKey" :class="$style.action">
			<MkButton :small="true" inline @click="openBskyEmbed">
				<i class="ti ti-brand-bluesky"></i> {{ i18n.ts.expandPost }}
			</MkButton>
		</div>
		<div v-if="!playerEnabled && player.url" :class="$style.action">
			<MkButton :small="true" inline @click="playerEnabled = true">
				<i class="ti ti-player-play"></i> {{ i18n.ts.enablePlayer }}
			</MkButton>
			<MkButton v-if="!isMobile" :small="true" inline @click="openPlayer()">
				<i class="ti ti-picture-in-picture"></i> {{ i18n.ts.openInWindow }}
			</MkButton>
		</div>
	</template>
</div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onDeactivated, onUnmounted, ref } from 'vue';
import { url as local } from '@@/js/config.js';
import { versatileLang } from '@@/js/intl-const.js';
import type { summaly } from '@misskey-dev/summaly';
import { i18n } from '@/i18n.js';
import * as os from '@/os.js';
import { deviceKind } from '@/scripts/device-kind.js';
import MkButton from '@/components/MkButton.vue';
import { transformPlayerUrl } from '@/scripts/player-url-transform.js';
import { defaultStore } from '@/store.js';

type SummalyResult = Awaited<ReturnType<typeof summaly>>;

const props = withDefaults(defineProps<{
	url: string;
	detail?: boolean;
	compact?: boolean;
	showActions?: boolean;
}>(), {
	detail: false,
	compact: false,
	showActions: true,
});

const MOBILE_THRESHOLD = 500;
const isMobile = ref(deviceKind === 'smartphone' || window.innerWidth <= MOBILE_THRESHOLD);

const self = props.url.startsWith(local);
const attr = self ? 'to' : 'href';
const target = self ? null : '_blank';
let fetching = ref(true);
const title = ref<string | null>(null);
const description = ref<string | null>(null);
const thumbnail = ref<string | null>(null);
const icon = ref<string | null>(null);
const sitename = ref<string | null>(null);
const sensitive = ref<boolean>(false);
const player = ref({
	url: null,
	width: null,
	height: null,
} as SummalyResult['player']);
const playerEnabled = ref(false);

const embedId = `embed${Math.random().toString().replace(/\D/, '')}`;
const postExpanded = ref(props.detail);
const postHeight = ref(150);

const tweetId = ref<string | null>(null);

// Steam専用のリアクティブ変数
let isSteam = false;
let steamAgeLimit = ref<string | null>(null);
let steamGameName = ref<string>("");
let steamDeveloper = ref<string>("");
let steamOnSale = ref(false);
let steamDiscount = ref<number>(0);
let steamOriginalPrice = ref<string>("");
let steamCurrentPrice = ref<string>("");
const defaultIcon = "https://store.steampowered.com/favicon.ico"; // デフォルトのファビコンURL
// Steamゲームデータを取得する関数
const fetchSteamData = async (steamAppId: string) => {
	try {
		const response = await fetch(
			`https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=jp&l=ja`
		);
		console.log(response);
		const data = await response.json();
		const gameData = data[steamAppId]?.data;
		if (gameData && data[steamAppId].success) {
			steamGameName = gameData.name;
			// ファビコンを通常の処理で取得
			icon = `https://store.steampowered.com/favicon.ico`;
			// 年齢制限の取得
			if (gameData.required_age && gameData.required_age !== "0") {
				steamAgeLimit = gameData.required_age;
			}
			// 開発者情報の取得
			if (gameData.developers && gameData.developers.length > 0) {
				steamDeveloper = gameData.developers.join(", ");
			}
			// 価格情報
			if (gameData.price_overview) {
				const priceOverview = gameData.price_overview;
				steamCurrentPrice = priceOverview.final_formatted;
				if (priceOverview.discount_percent > 0) {
					steamOnSale = true;
					steamDiscount = priceOverview.discount_percent;
					steamOriginalPrice = priceOverview.initial_formatted;
				}
			} else if (gameData.is_free) {
				steamCurrentPrice = "無料プレイ";
			} else {
				steamCurrentPrice = "価格情報なし";
			}
			fetching = false;
		}
	} catch (error) {
		console.error("Steamデータの取得中にエラーが発生しました:", error);
		fetching = false;
	}
};
// URLがSteamストアのものかどうかを判定し、App IDを抽出
const parseSteamUrl = (url: string): string | null => {
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
	} catch (error) {
		console.error("無効なURLです:", error);
		return null;
	}
};
const steamAppId = parseSteamUrl(props.url);
if (steamAppId) {
	isSteam = true;
}

const bskyHandleOrDid = ref<string | null>(null);
const bskyDid = ref<string | null>(null);
const bskyPostRecordKey = ref<string | null>(null);

const unknownUrl = ref(false);

onDeactivated(() => {
	playerEnabled.value = false;
});

const requestUrl = new URL(props.url);
if (!['http:', 'https:'].includes(requestUrl.protocol)) throw new Error('invalid url');

if (requestUrl.hostname === 'twitter.com' || requestUrl.hostname === 'mobile.twitter.com' || requestUrl.hostname === 'x.com' || requestUrl.hostname === 'mobile.x.com') {
	const m = requestUrl.pathname.match(/^\/.+\/status(?:es)?\/(\d+)/);
	if (m) tweetId.value = m[1];
}

if (requestUrl.hostname === 'bsky.app') {
	const bskyPostPageUrl = requestUrl.pathname.slice(1).split('/');

	if (bskyPostPageUrl[0] === 'profile' && bskyPostPageUrl[1] && bskyPostPageUrl[2] === 'post' && bskyPostPageUrl[3]) {
		bskyHandleOrDid.value = bskyPostPageUrl[1];
		bskyPostRecordKey.value = bskyPostPageUrl[3];

		if (postExpanded.value) {
			openBskyEmbed();
		}
	}
}

if (requestUrl.hostname === 'music.youtube.com' && requestUrl.pathname.match('^/(?:watch|channel)')) {
	requestUrl.hostname = 'www.youtube.com';
}

requestUrl.hash = '';

// Steamでない場合は一般的なURL情報を取得
if (!isSteam) {
	console.log("Not Steam.")
	window.fetch(`/url?url=${encodeURIComponent(requestUrl.href)}&lang=${versatileLang}`)
		.then(res => {
			if (!res.ok) {
				if (_DEV_) {
					console.warn(`[HTTP${res.status}] Failed to fetch url preview`);
				}
				return null;
			}

			return res.json();
		})
		.then((info: SummalyResult | null) => {
			if (!info || info.url == null) {
				fetching.value = false;
				unknownUrl.value = true;
				return;
			}

			fetching.value = false;
			unknownUrl.value = false;

			title.value = info.title;
			description.value = info.description;
			thumbnail.value = info.thumbnail;
			icon.value = info.icon;
			sitename.value = info.sitename;
			player.value = info.player;
			sensitive.value = info.sensitive ?? false;
		});

} else {
	// Steamの場合はSteamデータを取得
	fetchSteamData(steamAppId!);
}
async function openBskyEmbed() {
	if (bskyHandleOrDid.value == null || bskyPostRecordKey.value == null) return;

	if (bskyDid.value == null) {
		if (bskyHandleOrDid.value.startsWith('did:')) {
			bskyDid.value = bskyHandleOrDid.value;
		} else {
			// handleで来ている場合はdidに変換
			const bskyApiRes = await window.fetch(`https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${bskyHandleOrDid.value}`);
			if (bskyApiRes.ok) {
				const bskyApiData = await bskyApiRes.json() as { did: string };
				bskyDid.value = bskyApiData.did;
			}
		}
	}

	postExpanded.value = true;
}

function openPlayer(): void {
	const { dispose } = os.popup(defineAsyncComponent(() => import('@/components/MkYouTubePlayer.vue')), {
		url: requestUrl.href,
	}, {
		closed: () => {
			dispose();
		},
	});
}

function adjustSocialsEmbedHeight(message: MessageEvent) {
	if (message.origin === 'https://platform.twitter.com') {
		const embed = message.data?.['twttr.embed'];
		if (embed?.method === 'twttr.private.resize' && embed?.id === embedId) {
			const height = embed?.params[0]?.height;
			if (height) postHeight.value = height;
		}
	} else if (message.origin === 'https://embed.bsky.app') {
		if (message.data?.id === embedId) {
			const height = message.data?.height;
			if (height) postHeight.value = height;
		}
	}
}

window.addEventListener('message', adjustSocialsEmbedHeight);

onUnmounted(() => {
	window.removeEventListener('message', adjustSocialsEmbedHeight);
});
</script>

<style lang="scss" module>
.player {
	position: relative;
	width: 100%;
}

.disablePlayer {
	position: absolute;
	top: -1.5em;
	right: 0;
	font-size: 1em;
	width: 1.5em;
	height: 1.5em;
	padding: 0;
	margin: 0;
	color: var(--MI_THEME-fg);
	background: rgba(128, 128, 128, 0.2);
	opacity: 0.7;

	&:hover {
		opacity: 0.9;
	}
}

.playerIframe {
	height: 100%;
	left: 0;
	position: absolute;
	top: 0;
	width: 100%;
}

.link {
	position: relative;
	display: block;
	font-size: 14px;
	box-shadow: 0 0 0 1px var(--MI_THEME-divider);
	border-radius: 8px;
	overflow: clip;

	&:hover {
		text-decoration: none;
		border-color: rgba(0, 0, 0, 0.2);

		> .body > .header > .title {
			text-decoration: underline;
		}
	}

	&.compact {
		> .body {
			> .header .title, .text, .footer {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
}

.thumbnail {
	position: absolute;
	width: 100px;
	height: 100%;
	background-position: center;
	background-size: cover;
	background-color: var(--MI_THEME-bg);
	display: flex;
	justify-content: center;
	align-items: center;

	& + .body {
		left: 100px;
		width: calc(100% - 100px);
	}
}
.steam-preview {
	border: 1px solid var(--divider);
	border-radius: 0.5rem;
	padding: 0.5rem 1rem;
	background-color: var(--background);
	display: flex;
	flex-direction: column;
	pointer-events: auto;
	.steam-row {
		display: flex;
		align-items: center;
		margin-bottom: 0.25rem;
		&.steam-header {
			justify-content: flex-start;
			.favicon {
				width: 24px;
				height: 24px;
				margin-right: 0.5rem;
			}
			.steam-game-name {
				font-size: 1em;
				font-weight: bold;
			}
		}
		&.steam-developer {
			justify-content: flex-start;
			font-size: 0.9em;
			color: rgba(0, 0, 0, 0.6);
			margin-left: 2.5rem;
			margin-bottom: 0.5rem;
		}
		&.steam-pricing {
			justify-content: flex-end;
			align-items: center;
			.steam-discount {
				background-color: green;
				color: white;
				padding: 0.2rem 0.5rem;
				border-radius: 0.25rem;
				margin-right: 0.5rem;
				font-weight: bold;
			}
			.steam-original-price {
				text-decoration: line-through;
				color: rgba(0, 0, 0, 0.7
				);
				margin-right: 0.5rem;
			}
			.steam-current-price {
				font-size: 1em;
				font-weight: bold;
			}
		}
	}
}

.body {
	position: relative;
	box-sizing: border-box;
	padding: 16px;
}

.header {
	margin-bottom: 8px;
}

.title {
	margin: 0;
	font-size: 1em;
}

.text {
	margin: 0;
	font-size: 0.8em;
}

.footer {
	margin-top: 8px;
	height: 16px;
}

.siteIcon {
	display: inline-block;
	width: 16px;
	height: 16px;
	margin-right: 4px;
	vertical-align: top;
}

.siteName {
	display: inline-block;
	margin: 0;
	font-size: 0.8em;
	line-height: 16px;
	vertical-align: top;
}

.action {
	display: flex;
	gap: 6px;
	flex-wrap: wrap;
	margin-top: 6px;
}

@container (max-width: 400px) {
	.link {
		font-size: 12px;
	}

	.thumbnail {
		height: 80px;
	}

	.body {
		padding: 12px;
	}
}

@container (max-width: 350px) {
	.link {
		font-size: 10px;

		&.compact {
			> .thumbnail {
				position: absolute;
				width: 56px;
				height: 100%;
			}

			> .body {
				left: 56px;
				width: calc(100% - 56px);
				padding: 4px;

				> .header {
					margin-bottom: 2px;
				}

				> .footer {
					margin-top: 2px;
				}
			}
		}
	}

	.thumbnail {
		height: 70px;
	}

	.body {
		padding: 8px;
	}

	.header {
		margin-bottom: 4px;
	}

	.footer {
		margin-top: 4px;
	}

	.siteIcon {
		width: 12px;
		height: 12px;
	}
}
</style>
