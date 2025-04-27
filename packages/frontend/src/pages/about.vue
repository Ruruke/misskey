<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<PageWithHeader v-model:tab="tab" :actions="headerActions" :tabs="headerTabs">
	<MkSwiper v-model:tab="tab" :tabs="headerTabs">
		<div v-if="tab === 'overview'" class="_spacer" style="--MI_SPACER-w: 600px; --MI_SPACER-min: 20px;">
			<XOverview/>
		</div>
		<div v-else-if="tab === 'emojis'" class="_spacer" style="--MI_SPACER-w: 1000px; --MI_SPACER-min: 20px;">
			<XEmojis/>
		</div>
		<div v-else-if="instance.federation !== 'none' && tab === 'federation' || miLocalStorage.getItem('account') === null" class="_spacer" style="--MI_SPACER-w: 1000px; --MI_SPACER-min: 20px;">
			<XFederation/>
		</div>
		<div v-else-if="tab === 'charts' || miLocalStorage.getItem('account') === null" class="_spacer" style="--MI_SPACER-w: 1000px; --MI_SPACER-min: 20px;">
			<MkInstanceStats/>
		</div>
	</MkSwiper>
</PageWithHeader>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { instance } from '@/instance.js';
import { i18n } from '@/i18n.js';
import { claimAchievement } from '@/utility/achievements.js';
import { definePage } from '@/page.js';
import MkSwiper from '@/components/MkSwiper.vue';
import { miLocalStorage } from "@/local-storage.js";

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
if (miLocalStorage.getItem('account') === null && !(tab.value === 'overview' || tab.value === 'emojis')) {
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
	}, {
		key: 'emojis',
		title: i18n.ts.customEmojis,
		icon: 'ti ti-icons',
	}]);
}

definePage(() => ({
	title: i18n.ts.instanceInfo,
	icon: 'ti ti-info-circle',
}));
</script>
