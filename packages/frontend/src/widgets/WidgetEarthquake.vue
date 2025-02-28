<!--
SPDX-FileCopyrightText: harumaki2000
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkContainer :showHeader="widgetProps.showHeader" class="mkw-Earthquake">
	<template #icon><i class="ti ti-building-lighthouse"></i></template>
	<template #header>{{ i18n.ts._widgets.earthquake }}</template>
	<template #func="{ buttonStyleClass }">
		<button class="_button" :class="buttonStyleClass" @click="fetchLatestTime()"><i class="ti ti-refresh"></i></button>
	</template>
	<div class="$style.root">
		<p v-if="latestTime">最新の取得時刻: {{ formatDateTime(latestTime) }}</p>
		<div v-if="earthquakeData">
			<p>発生時刻: {{ earthquakeData.origin_time }}</p>
			<p>震源地: {{ earthquakeData.region_name }}</p>
			<p>最大震度: {{ earthquakeData.calcintensity }}</p>
			<p>マグニチュード: {{ earthquakeData.magnitude }}</p>
			<p>震源の深さ: {{ earthquakeData.depth }}</p>
		</div>
		<p v-else>地震情報を取得中...</p>
	</div>
</MkContainer>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useWidgetPropsManager } from './widget.js';
import type { WidgetComponentEmits, WidgetComponentExpose, WidgetComponentProps } from './widget.js';
import type { GetFormResultType } from '@/scripts/form.js';
import MkContainer from '@/components/MkContainer.vue';
import { i18n } from '@/i18n.js';

const name = 'earthquake';

const widgetPropsDef = {
	showHeader: {
		type: 'boolean' as const,
		default: true,
	},
	height: {
		type: 'number' as const,
		default: 100,
	},
};

type WidgetProps = GetFormResultType<typeof widgetPropsDef>;

const props = defineProps<WidgetComponentProps<WidgetProps>>();
const emit = defineEmits<WidgetComponentEmits<WidgetProps>>();

const { widgetProps, configure } = useWidgetPropsManager(name, widgetPropsDef, props, emit);

interface EarthquakeData {
	origin_time: string;
	region_name: string;
	calcintensity: string;
	magunitude: string;
	depth: string;
}

const latestTime = ref<string | null>(null);
const earthquakeData = ref<EarthquakeData | null>(null);
const fetching = ref(true);
let updateInterval: number | null = null;

const formatDateTime = (datetime: string | null): string => {
	return datetime
		? `${datetime.slice(0, 4)}/${datetime.slice(4, 6)}/${datetime.slice(6, 8)} `
      + `${datetime.slice(8, 10)}:${datetime.slice(10, 12)}:${datetime.slice(12, 14)}`
		: '情報なし';
};

const fetchLatestTime = async (): Promise<void> => {
	fetching.value = true;
	try {
		const response = await fetch('https://your-worker-subdomain.workers.dev/webservice/server/pros/latest.json', { cache: 'no-cache' });
		const data = await response.json();
		const rawTime = data.latest_time.replace(/\//g, '').replace(/ /g, '').replace(/:/g, '');
		latestTime.value = rawTime;
		await fetchEarthquakeData(rawTime);
	} catch (error) {
		console.error('最新の地震データ取得エラー:', error);
	}
	fetching.value = false;
};

const fetchEarthquakeData = async (time: string): Promise<void> => {
	try {
		const url = `https://your-worker-subdomain.workers.dev/webservice/hypo/eew/${time}.json`;
		const response = await fetch(url);
		const data = await response.json();
		earthquakeData.value = {
			origin_time: formatDateTime(data.origin_time),
			region_name: data.region_name,
			calcintensity: data.calcintensity,
			magunitude: data.magunitude,
			depth: data.depth ? `${data.depth} km` : '不明',
		};
	} catch (error) {
		console.error('詳細な地震データ取得エラー:', error);
	}
};

onMounted(() => {
	fetchLatestTime();
	updateInterval = setInterval(fetchLatestTime, 30000);
});

onUnmounted(() => {
	if (updateInterval !== null) {
		clearInterval(updateInterval);
	}
});

defineExpose<WidgetComponentExpose>({
	name,
	configure,
	id: props.widget ? props.widget.id : null,
});
</script>

<style lang="scss" module>
.root {
  padding: 16px;
}
</style>
