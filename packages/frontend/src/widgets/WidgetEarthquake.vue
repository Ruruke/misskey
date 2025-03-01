<!--
SPDX-FileCopyrightText: harumaki2000
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkContainer :showHeader="widgetProps.showHeader" class="mkw-Earthquake">
	<template #icon><i class="ti ti-building-lighthouse"></i></template>
	<template #header>{{ i18n.ts._widgets.earthquake }}</template>
	<template #func="{ buttonStyleClass }">
		<button class="_button" :class="buttonStyleClass" @click="reconnectWebSocket"><i class="ti ti-refresh"></i></button>
	</template>
	<div class="$style.root">
		<MkLoading v-if="fetching"></MkLoading>
		<p v-if="latestTime">最新の取得時刻: {{ formatDateTime(latestTime) }}</p>
		<div v-if="earthquakeData">
			<p>発生時刻: {{ earthquakeData.time }}</p>
			<p>震源地: {{ earthquakeData.location }}</p>
			<p>最大震度: {{ earthquakeData.shindo }}</p>
			<p>マグニチュード: {{ earthquakeData.magnitude }}</p>
			<p>震源の深さ: {{ earthquakeData.depth }}</p>
		</div>
		<p v-else>現在、地震情報はありません。</p>
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
	time: string;
	location: string;
	shindo: string;
	magnitude: string;
	depth: string;
}

const latestTime = ref<string | null>(null);
const earthquakeData = ref<EarthquakeData | null>(null);
const fetching = ref(true);
let ws: WebSocket | null = null;
let lastEarthquakeData: EarthquakeData | null = null;
let reconnecting = ref(false);

const formatDateTime = (datetime: string | null): string => {
	return datetime
		? `${datetime.slice(0, 4)}/${datetime.slice(4, 6)}/${datetime.slice(6, 8)} `
      + `${datetime.slice(8, 10)}:${datetime.slice(10, 12)}:${datetime.slice(12, 14)}`
		: '情報なし';
};

const connectWebSocket = () => {
	if (ws) {
		ws.close();
	}

	ws = new WebSocket('wss://ws-api.wolfx.jp/jma_eqlist');

	ws.onopen = () => {
		console.log('WebSocket 接続確立');
		fetching.value = false;
	};

	ws.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			if (data.type === 'heartbeat') {
				return;
			}
			if (data.type !== 'jma_eqlist' || !Array.isArray(data.data) || data.data.length === 0) {
				console.warn('不正なデータ形式:', data);
				return;
			}

			const latestEarthquake = data.data[0];

			const newEarthquakeData: EarthquakeData = {
				time: latestEarthquake.time,
				location: latestEarthquake.location,
				shindo: latestEarthquake.shindo ? `${latestEarthquake.shindo}` : '不明',
				magnitude: latestEarthquake.magnitude ? `${latestEarthquake.magnitude}` : '不明',
				depth: latestEarthquake.depth ? `${latestEarthquake.depth}` : '不明',
			};

			if (JSON.stringify(lastEarthquakeData) === JSON.stringify(newEarthquakeData)) {
				return;
			}

			earthquakeData.value = newEarthquakeData;
			latestTime.value = latestEarthquake.time;
			fetching.value = false;
			lastEarthquakeData = newEarthquakeData;
		} catch (error) {
			console.error('WebSocket データ解析エラー:', error);
		}
	};

	ws.onerror = (error) => {
		console.error('WebSocket エラー:', error);
		fetching.value = false;
		reconnecting.value = true;
	};

	ws.onclose = () => {
		console.log('WebSocket 切断');
		if (!reconnecting.value) {
			setTimeout(connectWebSocket, 5000);
		}
	};
};

const reconnectWebSocket = () => {
	if (!reconnecting.value) {
		console.log('WebSocket 再接続');
		reconnecting.value = true;
		fetching.value = true;
		connectWebSocket();
	}
};

onMounted(() => {
	connectWebSocket();
});

onUnmounted(() => {
	if (ws) {
		ws.close();
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
