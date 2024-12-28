<!--
SPDX-FileCopyrightText: ruru
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="_gaps_m">
	<FormSection>
		<template #label><span class="_beta">{{ i18n.ts._featureBy.shafu }}</span></template>
		<MkFolder>
			<template #label>{{ i18n.ts._customizeFeature.title }} <span class="_beta">{{ i18n.ts.originalFeature }}</span></template>
			<MkSwitch v-model="disableNoteNyaize">{{ i18n.ts.disableNoteNyaize }}<span class="_beta">{{ i18n.ts.originalFeature }}</span><span class="_beta">{{ i18n.ts.featureByShafu }}</span></MkSwitch>
			<br>
			<FromSlot v-model="selectReaction">
				<template #label>{{ i18n.ts.selectReaction }}<span class="_beta">{{ i18n.ts.originalFeature }}</span> <span class="_beta">{{ i18n.ts._featureBy.shafu }}</span></template>
				<MkCustomEmoji v-if="selectReaction && selectReaction.startsWith(':')" style="max-height: 3em; font-size: 1.1em;" :useOriginalSize="false" :name="selectReaction" :normal="true" :noStyle="true"/>
				<MkEmoji v-else-if="selectReaction && !selectReaction.startsWith(':')" :emoji="selectReaction" style="max-height: 3em; font-size: 1.1em;" :normal="true" :noStyle="true"/>
				<span v-else-if="!selectReaction">{{ i18n.ts.notSet }}</span>
				<div class="_buttons" style="padding-top: 8px;">
					<MkButton rounded :small="true" inline @click="chooseNewReaction"><i class="ph-smiley ph-bold ph-lg"></i> Change</MkButton>
					<MkButton rounded :small="true" inline @click="resetReaction"><i class="ph-arrow-clockwise ph-bold ph-lg"></i> Reset</MkButton>
				</div>
			</FromSlot>
			<br>
			<MkSelect v-model="customFont">
				<template #label>{{ i18n.ts.customFont }}<span class="_beta">{{ i18n.ts.originalFeature }}</span> <span class="_beta">{{ i18n.ts._featureBy.shafu }}</span></template>
				<option :value="null">{{ i18n.ts.default }}</option>
				<option v-for="[name, font] of Object.entries(fontList)" :value="name">{{ font.name }}</option>
			</MkSelect>
		</MkFolder>
	</FormSection>
</div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import * as Misskey from 'misskey-js';
import { i18n } from '@/i18n.js';
import MkSwitch from '@/components/MkSwitch.vue';
import MkSelect from '@/components/MkSelect.vue';
import MkRadios from '@/components/MkRadios.vue';
import MkFolder from '@/components/MkFolder.vue';
import MkButton from '@/components/MkButton.vue';
import FormSection from '@/components/form/section.vue';
import { fontList } from '@/scripts/font';
import { defaultStore } from '@/store.js';
import * as os from '@/os.js';
import { reloadAsk } from '@/scripts/reload-ask.js';

const selectReaction = computed(defaultStore.makeGetterSetter('selectReaction'));
const disableNoteNyaize = computed(defaultStore.makeGetterSetter('disableNoteNyaize'));
const customFont = computed(defaultStore.makeGetterSetter('customFont'));

function getHTMLElement(ev: MouseEvent): HTMLElement {
	const target = ev.currentTarget ?? ev.target;
	return target as HTMLElement; // イベント発生元の HTML 要素を取得
}

function chooseNewReaction(ev: MouseEvent) {
	os.pickEmoji(getHTMLElement(ev), {
		showPinned: false,
	}).then(async (emoji) => {
		selectReaction.value = emoji as string; // 選択された絵文字を格納
		await reloadAsk(); // 必要ならリロードや更新処理
	});
}

function resetReaction() {
	selectReaction.value = ''; // `selectReaction` をリセット
	reloadAsk(); // 必要ならリロードや更新処理
}

watch([
	selectReaction,
], async () => {
	await reloadAsk({ reason: i18n.ts.reloadToApplySetting, unison: true });
});
</script>
