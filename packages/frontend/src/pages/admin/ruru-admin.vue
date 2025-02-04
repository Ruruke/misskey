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
import { misskeyApi } from '@/scripts/misskey-api.js';
import { fetchInstance } from '@/instance.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import MkButton from '@/components/MkButton.vue';
import FormLink from '@/components/form/link.vue';
import MkFolder from '@/components/MkFolder.vue';
import { useForm } from '@/scripts/use-form.js';
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
}, async (state) => {
	const emojis = state.entranceSelectEmojis.split('\n').filter(emoji => emoji.trim() !== '');
	if (emojis.length > 5) {
		os.alert({
			type: 'error',
			text: '表示する絵文字は最大5個までです。',
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
	});
	fetchInstance(true);
});
const headerTabs = computed(() => []);

</script>
<style lang="scss" module>

</style>
