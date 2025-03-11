<!--
SPDX-FileCopyrightText: ruru, original: lqvp (https://github.com/lqvp/misskey-temp/blob/82d4050dde4f805962d5afa4ad31898cc7577a59/packages/frontend/src/pages/admin/temp-admin.vue)
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><XHeader :tabs="headerTabs"/></template>
	<MkSpacer :contentMax="700" :marginMin="16" :marginMax="32">
		<FormSuspense :p="init">
			<MkFolder>
				<template #icon><i class="ti ti-door-enter"></i></template>
				<template #label>{{ i18n.ts._entrance.title }}<span class="_beta">{{ i18n.ts.originalFeature }}</span></template>
				<template v-if="entranceSettingsForm.modified.value" #footer>
					<MkFormFooter :form="entranceSettingsForm"/>
				</template>
				<div class="_gaps_m">
					<MkSwitch v-model="entranceSettingsForm.state.entranceShowTimeLine">
						<template #label>{{ i18n.ts._entrance.showTimeLine }}</template>
						<template #caption>{{ i18n.ts._entrance.showTimeLineDescription }}</template>
					</MkSwitch>
					<MkSwitch v-model="entranceSettingsForm.state.entranceShowFeatured">
						<template #label>{{ i18n.ts._entrance.showFeatured }}</template>
						<template #caption>{{ i18n.ts._entrance.showFeaturedDescription }}</template>
					</MkSwitch>
					<MkSwitch v-model="entranceSettingsForm.state.entranceShowEmojis">
						<template #label>{{ i18n.ts._entrance.showEmojis }}</template>
						<template #caption>{{ i18n.ts._entrance.showEmojisDescription }}</template>
					</MkSwitch>
					<MkTextarea v-model="entranceSettingsForm.state.entranceSelectEmojis">
						<template #label>{{ i18n.ts._entrance.selectEmojis }}</template>
						<template #caption>{{ i18n.ts._entrance.selectEmojisDescription }}</template>
					</MkTextarea>
					<MkSwitch v-model="entranceSettingsForm.state.entranceShowStats">
						<template #label>{{ i18n.ts._entrance.showStats }}</template>
						<template #caption>{{ i18n.ts._entrance. showStatsDescription }}</template>
					</MkSwitch>
					<MkSwitch v-model="entranceSettingsForm.state.entranceShowFederation">
						<template #label>{{ i18n.ts._entrance.showFederation }}</template>
						<template #caption>{{ i18n.ts._entrance.showFederationDescription }}</template>
					</MkSwitch>
					<MkSwitch v-model="entranceSettingsForm.state.entranceShowDashboard">
						<template #label>{{ i18n.ts._entrance.showDashboard }}</template>
						<template #caption>{{ i18n.ts._entrance.showDashboardDescription }}</template>
					</MkSwitch>
					<MkFolder v-if="entranceSettingsForm.state.entranceShowDashboard">
						<template #icon><i class="ti ti-home-2"></i></template>
						<template #label>{{ i18n.ts._entrance. title2 }}</template>
						<div class="_gaps_m">
							<MkSwitch v-model="entranceSettingsForm.state.entranceShowSignup">
								<template #label>{{ i18n.ts._entrance.showSignup }}</template>
								<template #caption>{{ i18n.ts._entrance.showSignupDescription }}</template>
							</MkSwitch>
							<MkSwitch v-model="entranceSettingsForm.state.entranceShowAnotherInstance">
								<template #label>{{ i18n.ts._entrance.showAnotherInstance }}</template>
								<template #caption>{{ i18n.ts._entrance.showAnotherInstanceDescription }}</template>
							</MkSwitch>
							<MkSwitch v-model="entranceSettingsForm.state.entranceShowSignin">
								<template #label>{{ i18n.ts._entrance.showSignin }}</template>
								<template #caption>{{ i18n.ts._entrance.showSigninDescription }}</template>
							</MkSwitch>
						</div>
					</MkFolder>
				</div>
			</MkFolder>
			<MkFolder>
				<template #icon><i class="ti ti-box-margin"></i></template>
				<template #label>{{ i18n.ts._entrance.marginSettings }}</template>
				<div class="_gaps_m">
					<MkInput v-model="entranceSettingsForm.state.entranceMarginLeft" type="number" :min="0">
						<template #label>{{ i18n.ts._entrance.marginLeft }}</template>
					</MkInput>
					<MkInput v-model="entranceSettingsForm.state.entranceMarginRight" type="number" :min="0">
						<template #label>{{ i18n.ts._entrance.marginRight }}</template>
					</MkInput>
					<MkInput v-model="entranceSettingsForm.state.entranceMarginTop" type="number" :min="0">
						<template #label>{{ i18n.ts._entrance.marginTop }}</template>
					</MkInput>
					<MkInput v-model="entranceSettingsForm.state.entranceMarginBottom" type="number" :min="0">
						<template #label>{{ i18n.ts._entrance.marginBottom }}</template>
					</MkInput>
				</div>
			</MkFolder>
		</FormSuspense>
	</MkSpacer>
</MkStickyContainer>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import XHeader from './_header_.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import MkInput from '@/components/MkInput.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import FormSuspense from '@/components/form/suspense.vue';
import * as os from '@/os.js';
import { misskeyApi } from '@/utility/misskey-api.js';
import { fetchInstance } from '@/instance.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/page.js';
import MkButton from '@/components/MkButton.vue';
import FormLink from '@/components/form/link.vue';
import MkFolder from '@/components/MkFolder.vue';
import { useForm } from '@/utility/use-form.js';
import MkFormFooter from '@/components/MkFormFooter.vue';

const meta = await misskeyApi('admin/meta');

const entranceShowTimeLine = ref<boolean>(false);
const entranceShowFeatured = ref<boolean>(false);
const entranceShowEmojis = ref<boolean>(false);
const entranceSelectEmojis = ref<string[]>([]);
const entranceShowStats = ref<boolean>(false);
const entranceShowFederation = ref<boolean>(false);
const entranceShowDashboard = ref<boolean>(false);
const entranceShowSignup = ref<boolean>(false);
const entranceShowAnotherInstance = ref<boolean>(false);
const entranceShowSignin = ref<boolean>(false);
const entranceMarginLeft = ref<number>();
const entranceMarginRight = ref<number>();
const entranceMarginTop = ref<number>();
const entranceMarginBottom = ref<number>();

async function init() {
	entranceShowTimeLine.value = meta.entranceShowTimeLine;
	entranceShowFeatured.value = meta.entranceShowFeatured;
	entranceShowEmojis.value = meta.entranceShowEmojis;
	entranceSelectEmojis.value = meta.entranceSelectEmojis;
	entranceShowStats.value = meta.entranceShowStats;
	entranceShowFederation.value = meta.entranceShowFederation;
	entranceShowDashboard.value = meta.entranceShowDashboard;
	entranceShowSignup.value = meta.entranceShowSignup;
	entranceShowAnotherInstance.value = meta.entranceShowAnotherInstance;
	entranceShowSignin.value = meta.entranceShowSignin;
	entranceMarginLeft.value = meta.entranceMarginLeft;
	entranceMarginRight.value = meta.entranceMarginRight;
	entranceMarginTop.value = meta.entranceMarginTop;
	entranceMarginBottom.value = meta.entranceMarginBottom;
}

const entranceSettingsForm = useForm({
	entranceShowTimeLine: meta.entranceShowTimeLine,
	entranceShowFeatured: meta.entranceShowFeatured,
	entranceShowEmojis: meta.entranceShowEmojis,
	entranceSelectEmojis: meta.entranceSelectEmojis.join('\n'),
	entranceShowStats: meta.entranceShowStats,
	entranceShowFederation: meta.entranceShowFederation,
	entranceShowDashboard: meta.entranceShowDashboard,
	entranceShowSignup: meta.entranceShowSignup,
	entranceShowAnotherInstance: meta.entranceShowAnotherInstance,
	entranceShowSignin: meta.entranceShowSignin,
	entranceMarginLeft: Number(meta.entranceMarginLeft),
	entranceMarginRight: Number(meta.entranceMarginRight),
	entranceMarginTop: Number(meta.entranceMarginTop),
	entranceMarginBottom: Number(meta.entranceMarginBottom),

}, async (state) => {
	const emojis = state.entranceSelectEmojis.split('\n').filter(emoji => emoji.trim() !== '');
	if (emojis.length > 5) {
		os.alert({
			type: 'error',
			text: '表示する絵文字は最大5個までです。',
		});
		return;
	}
	const parsedMargins = {
		entranceMarginLeft: Number(state.entranceMarginLeft),
		entranceMarginRight: Number(state.entranceMarginRight),
		entranceMarginTop: Number(state.entranceMarginTop),
		entranceMarginBottom: Number(state.entranceMarginBottom),
	};
	if (Object.values(parsedMargins).some(isNaN)) {
		os.alert({
			type: 'error',
			text: 'マージン値は数値で入力してください',
		});
		return;
	}

	await os.apiWithDialog('admin/update-meta', {
		entranceShowTimeLine: state.entranceShowTimeLine,
		entranceShowFeatured: state.entranceShowFeatured,
		entranceShowEmojis: state.entranceShowEmojis,
		entranceSelectEmojis: state.entranceSelectEmojis.split('\n').slice(0, 5),
		entranceShowStats: state.entranceShowStats,
		entranceShowFederation: state.entranceShowFederation,
		entranceShowDashboard: state.entranceShowDashboard,
		entranceShowSignup: state.entranceShowSignup,
		entranceShowAnotherInstance: state.entranceShowAnotherInstance,
		entranceShowSignin: state.entranceShowSignin,
		entranceMarginLeft: state.entranceMarginLeft,
		entranceMarginRight: state.entranceMarginRight,
		entranceMarginTop: state.entranceMarginTop,
		entranceMarginBottom: state.entranceMarginBottom,

	});
	fetchInstance(true);
});
const headerTabs = computed(() => []);

</script>
<style lang="scss" module>

</style>
