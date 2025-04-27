<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div ref="rootEl" :class="[$style.root, reversed ? '_pageScrollableReversed' : '_pageScrollable']">
	<MkStickyContainer>
		<template #header><MkPageHeader v-model:tab="tab" :actions="actions" :tabs="tabs"/></template>
		<div :class="$style.body">
			<MkSwiper v-if="swipable" v-model:tab="tab" :class="$style.swiper" :tabs="props.tabs">
				<slot></slot>
			</MkSwiper>
			<slot v-else></slot>
		</div>
		<template #footer><slot name="footer"></slot></template>
	</MkStickyContainer>
</div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import { scrollInContainer } from '@@/js/scroll.js';
import type { PageHeaderItem } from '@/types/page-header.js';
import type { Tab } from './MkPageHeader.tabs.vue';
import { useScrollPositionKeeper } from '@/use/use-scroll-position-keeper.js';
import MkSwiper from '@/components/MkSwiper.vue';
import { useRouter } from '@/router.js';

const props = withDefaults(defineProps<{
	tabs?: Tab[];
	actions?: PageHeaderItem[] | null;
	thin?: boolean;
	hideTitle?: boolean;
	displayMyAvatar?: boolean;
	reversed?: boolean;
}>(), {
	tabs: () => ([] as Tab[]),
});

const tab = defineModel<string>('tab');
const rootEl = useTemplateRef('rootEl');

useScrollPositionKeeper(rootEl);

const router = useRouter();

router.useListener('same', () => {
	scrollToTop();
});

function scrollToTop() {
	if (rootEl.value) scrollInContainer(rootEl.value, { top: 0, behavior: 'smooth' });
}

defineExpose({
	scrollToTop,
});
</script>

<style lang="scss" module>
.root {

}

.body, .swiper {
	min-height: calc(100cqh - (var(--MI-stickyTop, 0px) + var(--MI-stickyBottom, 0px)));
}
</style>
