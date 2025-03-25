<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<img
	v-if="errored && fallbackToImage"
	:class="[$style.root, { [$style.normal]: normal, [$style.noStyle]: noStyle }]"
	src="/client-assets/dummy.png"
	:title="alt"
	draggable="false"
	style="-webkit-user-drag: none;"
/>
<span v-else-if="errored">:{{ customEmojiName }}:</span>
<img
	v-else
	:class="[$style.root, { [$style.normal]: normal, [$style.noStyle]: noStyle }]"
	:src="url"
	:alt="alt"
	:title="alt"
	decoding="async"
	draggable="false"
	@error="errored = true"
	@load="errored = false"
	@click="onClick"
/>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, inject, ref, defineAsyncComponent } from 'vue';
import { getProxiedImageUrl, getStaticImageUrl } from '@/utility/media-proxy.js';
import type { MenuItem } from '@/types/menu.js';
import { customEmojis, customEmojisMap } from '@/custom-emojis.js';
import * as os from '@/os.js';
import { misskeyApi, misskeyApiGet } from '@/utility/misskey-api.js';
import { copyToClipboard } from '@/utility/copy-to-clipboard.js';
import { i18n } from '@/i18n.js';
import MkCustomEmojiDetailedDialog from '@/components/MkCustomEmojiDetailedDialog.vue';
import { $i } from '@/i.js';
import { prefer } from '@/preferences.js';
import { DI } from '@/di.js';
import * as sound from '@/utility/sound.js';
import { store } from '@/store.js';

const props = defineProps<{
	name: string;
	normal?: boolean;
	noStyle?: boolean;
	host?: string | null;
	url?: string;
	useOriginalSize?: boolean;
	menu?: boolean;
	menuReaction?: boolean;
	fallbackToImage?: boolean;
}>();

const react = inject(DI.mfmEmojiReactCallback);

const customEmojiName = computed(() => (props.name[0] === ':' ? props.name.substring(1, props.name.length - 1) : props.name).replace('@.', ''));
const isLocal = computed(() => !props.host && (customEmojiName.value.endsWith('@.') || !customEmojiName.value.includes('@')));
const canReact = computed(() => isLocal.value || customEmojisMap.has(customEmojiName.value));

const rawUrl = computed(() => {
	if (props.url) {
		return props.url;
	}
	if (isLocal.value) {
		return customEmojisMap.get(customEmojiName.value)?.url ?? null;
	}
	return props.host ? `/emoji/${customEmojiName.value}@${props.host}.webp` : `/emoji/${customEmojiName.value}.webp`;
});

const playAnimation = ref(true);
if (store.s.showingAnimatedImages === 'interaction') playAnimation.value = false;
let playAnimationTimer = setTimeout(() => playAnimation.value = false, 5000);
const url = computed(() => {
	if (rawUrl.value == null) return undefined;

	const proxied =
		(rawUrl.value.startsWith('/emoji/') || (props.useOriginalSize && isLocal.value))
			? rawUrl.value
			: getProxiedImageUrl(
				rawUrl.value,
				props.useOriginalSize ? undefined : 'emoji',
				false,
				true,
			);
		return prefer.s.disableShowingAnimatedImages
			//TODO: Reactionはcherrypickの方の仕組みに移行してもいいかも？
			// return store.r.disableShowingAnimatedImages.value || (['interaction', 'inactive'].includes(<string>store.r.showingAnimatedImages.value) && !playAnimation.value)
		? getStaticImageUrl(proxied)
		: proxied;
});

const alt = computed(() => `:${customEmojiName.value}:`);
const errored = ref(url.value == null);

function onClick(ev: MouseEvent) {
	if (props.menu) {
		const menuItems: MenuItem[] = [];

		menuItems.push({
			type: 'label',
			text: `:${props.name}:`,
		}, {
			text: i18n.ts.copy,
			icon: 'ti ti-copy',
			action: () => {
				copyToClipboard(`:${props.name}:`);
			},
		});

		if (props.menuReaction && react) {
			menuItems.push({
				text: i18n.ts.doReaction,
				icon: 'ti ti-plus',
				action: () => {
					react(`:${props.name}:`);
				},
			});
		}

		menuItems.push({
			text: i18n.ts.info,
			icon: 'ti ti-info-circle',
			action: async () => {
				const { dispose } = os.popup(MkCustomEmojiDetailedDialog, {
					emoji: await misskeyApiGet('emoji', {
						name: customEmojiName.value,
					}),
				}, {
					closed: () => dispose(),
				});
			},
		});

		if ($i?.isModerator ?? $i?.isAdmin) {
			menuItems.push({
				text: i18n.ts.edit,
				icon: 'ti ti-pencil',
				action: async () => {
					await edit(props.name);
				},
			});
		}

		os.popupMenu(menuItems, ev.currentTarget ?? ev.target);
	}
}

async function edit(name: string) {
	const emoji = await misskeyApi('emoji', {
		name: name,
	});
	const { dispose } = os.popup(defineAsyncComponent(() => import('@/pages/emoji-edit-dialog.vue')), {
		emoji: emoji,
	}, {
		closed: () => dispose(),
	});
}

function resetTimer() {
	playAnimation.value = true;
	clearTimeout(playAnimationTimer);
	playAnimationTimer = setTimeout(() => playAnimation.value = false, 5000);
}

onMounted(() => {
	if (store.s.showingAnimatedImages === 'inactive') {
		window.addEventListener('mousemove', resetTimer);
		window.addEventListener('touchstart', resetTimer);
		window.addEventListener('touchend', resetTimer);
	}
});

onUnmounted(() => {
	if (store.s.showingAnimatedImages === 'inactive') {
		window.removeEventListener('mousemove', resetTimer);
		window.removeEventListener('touchstart', resetTimer);
		window.removeEventListener('touchend', resetTimer);
	}
});
</script>

<style lang="scss" module>
.root {
	height: 2em;
	vertical-align: middle;
	-webkit-user-drag: none;
	transition: transform 0.2s ease;

	&:hover {
		transform: scale(1.2);
	}
}

.normal {
	height: 1.25em;
	vertical-align: -0.25em;

	&:hover {
		transform: none;
	}
}

.noStyle {
	height: auto !important;
}
</style>
