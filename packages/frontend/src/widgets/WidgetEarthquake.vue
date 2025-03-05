<!--
SPDX-FileCopyrightText: harumaki2000
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkContainer :showHeader="widgetProps.showHeader" class="mkw-Earthquake">
	<template #icon><i class="ti ti-building-lighthouse"></i></template>
	<template #header>{{ i18n.ts._widgets.earthquake }}</template>
	<template #func="{ buttonStyleClass }">
		<button class="_button" :class="buttonStyleClass" @click="reconnectWebSocket">
			<i class="ti ti-refresh"></i>
		</button>
	</template>
	<div class="$style.root">
		<MkLoading v-if="fetching"></MkLoading>
		<div v-if="earthquakeData">
			<p>{{ earthquakeData.title }}</p>
			<p>発生時刻: {{ earthquakeData.time }}</p>
			<p>震源地: {{ earthquakeData.location }}</p>
			<p>最大震度: {{ formatShindo(earthquakeData.shindo) }}</p>
			<p>マグニチュード: {{ earthquakeData.magnitude }}</p>
			<p>震源の深さ: {{ earthquakeData.depth }}</p>
			<p>{{ earthquakeData.info }}</p>
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
	title: string;
	time: string;
	location: string;
	shindo: string;
	magnitude: string;
	depth: string;
	info: string;
}

const earthquakeData = ref<EarthquakeData | null>(null);
const fetching = ref(false);
let ws: WebSocket | null = null;
let reconnecting = ref(false);

const showLoadingTemporarily = () => {
	fetching.value = true;
	setTimeout(() => {
		fetching.value = false;
	}, 1000);
};

const formatShindo = (shindo: string): string => {
	switch (shindo) {
		case '1':
		case '2':
		case '3':
		case '4':
		case '7':
			return `震度${shindo}`;
		case '5-':
			return '震度5弱';
		case '5+':
			return '震度5強';
		case '6-':
			return '震度6弱';
		case '6+':
			return '震度6強';
		default:
			return '震度不明';
	}
};

const connectWebSocket = () => {
	if (ws) {
		ws.close();
	}

	ws = new WebSocket('wss://ws-api.wolfx.jp/jma_eqlist');

	ws.onopen = () => {
		console.log('WebSocket 接続確立');
		showLoadingTemporarily();
	};

	ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log('受信データ:', data);

        if (data.type === 'heartbeat') {
            return;
        }

        if (Object.keys(data).length === 0 || !data.data) {
            console.warn('データが空です:', data);
            earthquakeData.value = null;
            showLoadingTemporarily();
            return;
        }

        const latestEarthquake = Object.values(data.data)[0];

        if (!latestEarthquake) {
            console.warn('有効な地震データがありません:', data.data);
            return;
        }

        const newEarthquakeData: EarthquakeData = {
            title: latestEarthquake.Title,
            time: latestEarthquake.time_full || latestEarthquake.time,
            location: latestEarthquake.location,
            shindo: formatShindo(latestEarthquake.shindo ?? '不明'),
            magnitude: latestEarthquake.magnitude ?? '不明',
            depth: latestEarthquake.depth ?? '不明',
            info: latestEarthquake.info ?? '情報なし',
        };

        if (JSON.stringify(earthquakeData.value) === JSON.stringify(newEarthquakeData)) {
            return;
        }

        earthquakeData.value = newEarthquakeData;
        showLoadingTemporarily();
    } catch (error) {
        console.error('WebSocket データ解析エラー:', error);
    }
};

	ws.onerror = (error) => {
		console.error('WebSocket エラー:', error);
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
		showLoadingTemporarily();
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
