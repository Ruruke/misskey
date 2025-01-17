<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<!--
出典：気象庁 https://www.jma.go.jp/bosai/forecast/
利用規約：https://www.jma.go.jp/jma/kishou/info/coment.html
-->

<template>
<MkContainer :showHeader="widgetProps.showHeader" class="mkw-weather">
	<template #icon><i class="ti ti-cloud"></i></template>
	<template #header>{{ i18n.ts._widgets.weather }}</template>
	<template #func="{ buttonStyleClass }">
		<button class="_button" :class="buttonStyleClass" @click="refreshWeatherData"><i class="ti ti-refresh"></i></button>
		<button class="_button" :class="buttonStyleClass" @click="configure"><i class="ti ti-settings"></i></button>
	</template>

	<div>
		<MkLoading v-if="fetching"/>
		<div v-else class="weather-container">
			<div class="weather-days">
				<div v-for="(day, index) in weatherData[0].timeSeries[0].timeDefines" :key="index" class="weather-day">
					<div class="weather-date">{{ formatDate(day) }}</div>
					<img :src="getWeatherIcon(weatherData[0].timeSeries[0].areas[0].weatherCodes[index])" alt="Weather Icon" class="weather-icon"/>
					<div class="weather-temp">
						<span class="temp-max">{{ getMaxTemp(index) }}°C</span>
						<span class="temp-separator"> / </span>
						<span class="temp-min">{{ getMinTemp(index) }}°C</span>
					</div>
					<div class="weather-pop">
						<span v-for="(pop, popIndex) in getPops(index)" :key="popIndex" class="pop-item">
							{{ pop }}<span v-if="popIndex < getPops(index).length - 1" class="pop-separator"> / </span>
						</span>
					</div>
				</div>
			</div>
			<div class="weather-update-time">
				{{ publishingOffice }} |
				{{ reportDatetime }} |
				{{ updateTime }}
			</div>
		</div>
	</div>
</MkContainer>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useWidgetPropsManager, WidgetComponentEmits, WidgetComponentExpose, WidgetComponentProps } from './widget.js';
import { GetFormResultType } from '@/scripts/form.js';
import MkContainer from '@/components/MkContainer.vue';
import { i18n } from '@/i18n.js';

const name = i18n.ts._widgets.weather;

const widgetPropsDef = {
	showHeader: {
		type: 'boolean' as const,
		default: true,
	},
	areaCode: {
		type: 'string' as const,
		default: '100000',
	},
	areasCode: {
		type: 'string' as const,
		default: '42251',
	},
	weatherCodeGistUrl: {
		type: 'string' as const,
		default: 'https://gist.githubusercontent.com/lqvp/3ab8701f4b8e008d5e55c304ca32b930/raw/2097934ee7de18af1ec646ba1b52bd5dd8d23c58/weathercode.json',
	},
	refreshIntervalSec: {
		type: 'number' as const,
		default: 3600,
	},
	info: {
		type: 'string' as const,
		multiline: true,
		default: '出典：気象庁 (https://www.jma.go.jp/bosai/forecast/)\n利用規約：https://www.jma.go.jp/jma/kishou/info/coment.html\n使い方：https://gist.github.com/lqvp/09e6221bde29cb968147a08a5c94a7ad',
	},
};

type WidgetProps = GetFormResultType<typeof widgetPropsDef>;

const props = defineProps<WidgetComponentProps<WidgetProps>>();
const emit = defineEmits<WidgetComponentEmits<WidgetProps>>();

const { widgetProps, configure } = useWidgetPropsManager(name, widgetPropsDef, props, emit);

const fetching = ref(true);
const weatherData = ref<any>(null);
const updateTime = ref('');
const publishingOffice = ref('');
const reportDatetime = ref('');
const intervalId = ref<ReturnType<typeof setInterval> | null>(null);
const weatherCodeMapping = ref<Record<string, string[]>>({});

const fetchWeatherData = async () => {
	try {
		fetching.value = true;
		const response = await fetch(`https://www.jma.go.jp/bosai/forecast/data/forecast/${widgetProps.areaCode}.json`);
		const data = await response.json();
		weatherData.value = data;
		publishingOffice.value = data[0]?.publishingOffice ?? '';
		reportDatetime.value = data[0]?.reportDatetime ?? '';
		updateTime.value = new Date().toLocaleTimeString();
	} catch (error) {
		console.error('Failed to fetch weather data:', error);
	}
	fetching.value = false;
};

const refreshWeatherData = () => {
	fetchWeatherData();
};

const fetchWeatherCodeMapping = async () => {
	try {
		const response = await fetch( widgetProps.weatherCodeGistUrl);
		const data = await response.json();
		weatherCodeMapping.value = data;
	} catch (error) {
		console.error('Failed to fetch weather code mapping:', error);
	}
};

const getWeatherIcon = (weatherCode: string) => {
	const telops = weatherCodeMapping.value[weatherCode];
	if (telops && telops[0]) {
		return `https://www.jma.go.jp/bosai/forecast/img/${telops[0]}`;
	}
	return `https://www.jma.go.jp/bosai/forecast/img/${weatherCode}.svg`;
};

const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return `${date.getMonth() + 1}/${date.getDate()}(${['日', '月', '火', '水', '木', '金', '土'][date.getDay()]})`;
};

const getMaxTemp = (index: number) => {
	const timeDefines = weatherData.value[0]?.timeSeries[0]?.timeDefines;
	const targetDate = timeDefines[index];

	// 1日目の気温データ
	if (index === 0) {
		const temps = weatherData.value[0]?.timeSeries[2]?.areas.find((area: any) => area.area.code === widgetProps.areasCode)?.temps;
		return temps ? temps[0] : '?';
	}

	// 2日目以降の気温データ
	const longTermTemps = weatherData.value[1]?.timeSeries[1]?.areas.find((area: any) => area.area.code === widgetProps.areasCode)?.tempsMax;
	if (longTermTemps && longTermTemps[index] !== undefined) {
		return longTermTemps[index];
	}

	return '?';
};

const getMinTemp = (index: number) => {
	const timeDefines = weatherData.value[0]?.timeSeries[0]?.timeDefines;
	const targetDate = timeDefines[index];

	// 1日目の気温データ
	if (index === 0) {
		const temps = weatherData.value[0]?.timeSeries[2]?.areas.find((area: any) => area.area.code === widgetProps.areasCode)?.temps;
		return temps ? temps[1] : '?';
	}

	// 2日目以降の気温データ
	const longTermTemps = weatherData.value[1]?.timeSeries[1]?.areas.find((area: any) => area.area.code === widgetProps.areasCode)?.tempsMin;
	if (longTermTemps && longTermTemps[index] !== undefined) {
		return longTermTemps[index];
	}

	return '?';
};

const getPops = (index: number) => {
	const pops = weatherData.value[0]?.timeSeries[1]?.areas[0]?.pops;
	if (Array.isArray(pops)) {
		return pops.slice(0, 3).map(pop => `${pop}%`);
	} else if (typeof pops === 'string') {
		return pops.split(' / ').map(pop => `${pop}%`);
	} else {
		return [];
	}
};

const setupAutoRefresh = () => {
	if (intervalId.value) {
		clearInterval(intervalId.value);
		intervalId.value = null;
	}
	if (widgetProps.refreshIntervalSec > 0) {
		intervalId.value = setInterval(() => {
			fetchWeatherData();
		}, widgetProps.refreshIntervalSec * 1000);
	}
};

watch(() => widgetProps.refreshIntervalSec, setupAutoRefresh, { immediate: true });

onBeforeUnmount(() => {
	if (intervalId.value) {
		clearInterval(intervalId.value);
		intervalId.value = null;
	}
});

watch(() => widgetProps.areaCode, fetchWeatherData, { immediate: true });
watch(() => widgetProps.areasCode, fetchWeatherData, { immediate: true });

onMounted(() => {
	fetchWeatherData();
	fetchWeatherCodeMapping();
});

defineExpose<WidgetComponentExpose>({
	name,
	configure,
	id: props.widget ? props.widget.id : null,
});
</script>

<style lang="scss" scoped>
.weather-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		padding: 8px;
}

.weather-days {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
		gap: 8px;
}

.weather-day {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		flex: 1;
		padding: 8px;
		border-right: 1px solid #eee;
}

.weather-day:last-child {
		border-right: none;
}

.weather-date {
		font-size: 12px;
}

.weather-icon {
		width: 40px;
		height: 40px;
}

.weather-temp {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4px;
}

.temp-max {
		font-size: 14px;
		font-weight: bold;
		color: #f04715;
}

.temp-min {
		font-size: 12px;
		color: #0988e6;
}

.temp-separator {
		font-size: 12px;
		color: #666;
}

.weather-pop {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
}

.pop-item {
    font-size: 10px;
}

.pop-separator {
    font-size: 10px;
    color: #666;
}

.weather-update-time {
		font-size: 10px;
		color: #666;
		margin-top: 8px;
}
</style>
