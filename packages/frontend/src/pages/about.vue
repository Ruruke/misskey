<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><MkPageHeader v-model:tab="tab" :actions="headerActions" :tabs="headerTabs"/></template>
	<MkHorizontalSwipe v-model:tab="tab" :tabs="headerTabs">
		<MkSpacer v-if="tab === 'overview'" :contentMax="600" :marginMin="20">
			<XOverview/>
		</MkSpacer>
		<MkSpacer v-else-if="tab === 'emojis' || miLocalStorage.getItem('account') === null" :contentMax="1000" :marginMin="20">
			<XEmojis/>
		</MkSpacer>
		<MkSpacer v-else-if="tab === 'federation' || miLocalStorage.getItem('account') === null " :contentMax="1000" :marginMin="20">
			<XFederation/>
		</MkSpacer>
		<MkSpacer v-else-if="tab === 'charts' || miLocalStorage.getItem('account') === null" :contentMax="1000" :marginMin="20">
			<MkInstanceStats/>
		</MkSpacer>
	</MkHorizontalSwipe>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { i18n } from '@/i18n.js';
import { claimAchievement } from '@/scripts/achievements.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import MkHorizontalSwipe from '@/components/MkHorizontalSwipe.vue';
import {miLocalStorage} from "@/local-storage.js";


const XOverview = defineAsyncComponent(() => import('@/pages/about.overview.vue'));
const XEmojis = defineAsyncComponent(() => import('@/pages/about.emojis.vue'));
const XFederation = defineAsyncComponent(() => import('@/pages/about.federation.vue'));
const MkInstanceStats = defineAsyncComponent(() => import('@/components/MkInstanceStats.vue'));

const props = withDefaults(defineProps<{
	initialTab?: string;
}>(), {
	initialTab: 'overview',
});

let tab = ref(props.initialTab);
if(miLocalStorage.getItem('account') === null){
	tab = ref("overview");
}

watch(tab, () => {
	if (tab.value === 'charts') {
		claimAchievement('viewInstanceChart');
	}
});

const headerActions = computed(() => []);

let headerTabs = computed(() => [{
	key: 'overview',
	title: i18n.ts.overview,
}, {
	key: 'emojis',
	title: i18n.ts.customEmojis,
	icon: 'ti ti-icons',
}, {
	key: 'federation',
	title: i18n.ts.federation,
	icon: 'ti ti-whirl',
}, {
	key: 'charts',
	title: i18n.ts.charts,
	icon: 'ti ti-chart-line',
}]);

if (miLocalStorage.getItem('account') === null) {
	headerTabs = computed(() => [{
		key: 'overview',
		title: i18n.ts.overview,
	}]);

}

definePageMetadata(() => ({
	title: i18n.ts.instanceInfo,
	icon: 'ti ti-info-circle',
}));
</script>
