<!--
SPDX-FileCopyrightText: ruru
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div>
	<MkFolder :defaultOpen="true">
		<template #icon><i class="ti ti-ghost"></i></template>
		<template #label>{{ i18n.ts.proxyAccount }}</template>
		<template v-if="proxyAccountForm.modified.value" #footer>
			<MkFormFooter :form="proxyAccountForm"/>
		</template>

		<div class="_gaps">
			<MkInfo>{{ i18n.ts.proxyAccountDescription }}</MkInfo>

			<div class="_panel">
				<div :class="$style.banner" :style="{ backgroundImage: proxyAccount.bannerUrl ? `url(${ proxyAccount.bannerUrl })` : null }">
					<MkButton primary rounded :class="$style.bannerEdit" @click="changeProxyAccountBanner">{{ i18n.ts._profile.changeBanner }}</MkButton>
				</div>
				<div :class="$style.avatarContainer">
					<MkAvatar :class="$style.avatar" :user="proxyAccount" forceShowDecoration @click="changeProxyAccountAvatar"/>
					<div class="_buttonsCenter">
						<MkButton primary rounded @click="changeProxyAccountAvatar">{{ i18n.ts._profile.changeAvatar }}</MkButton>
					</div>
				</div>
			</div>

			<MkInput v-model="proxyAccountForm.state.name" :max="30" :mfmAutocomplete="['emoji']">
				<template #label>{{ i18n.ts._profile.name }}</template>
			</MkInput>

			<MkTextarea v-model="proxyAccountForm.state.description" :max="500" tall mfmAutocomplete :mfmPreview="true">
				<template #label>{{ i18n.ts._profile.description }}</template>
				<template #caption>{{ i18n.ts._profile.youCanIncludeHashtags }}</template>
			</MkTextarea>
		</div>
	</MkFolder>
</div>
</template>

<script lang="ts" setup>

import { ref, computed, reactive } from 'vue';
import XHeader from './_header_.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import MkInput from '@/components/MkInput.vue';
import MkTextarea from '@/components/MkTextarea.vue';
import MkInfo from '@/components/MkInfo.vue';
import FormSplit from '@/components/form/split.vue';
import * as os from '@/os.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { fetchInstance, instance } from '@/instance.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import MkButton from '@/components/MkButton.vue';
import MkFolder from '@/components/MkFolder.vue';
import MkKeyValue from '@/components/MkKeyValue.vue';
import { useForm } from '@/scripts/use-form.js';
import MkFormFooter from '@/components/MkFormFooter.vue';
import MkRadios from '@/components/MkRadios.vue';
import { selectFile } from '@/scripts/select-file.js';
import { globalEvents } from '@/events.js';
import { claimAchievement } from '@/scripts/achievements.js';

const meta = await misskeyApi('admin/meta');

const proxyAccount = ref(meta.proxyAccountId ? await misskeyApi('users/show', { userId: meta.proxyAccountId }) : null);
const proxyAccountProfile = reactive({
	name: proxyAccount.value.name,
	description: proxyAccount.value.description,
});

const proxyAccountForm = useForm({
	name: proxyAccountProfile.name,
	description: proxyAccountProfile.description,
}, async (state) => {
	await os.apiWithDialog('admin/update-proxy-account', {
		name: state.name,
		description: state.description,
	});
	fetchInstance(true);
});

function changeProxyAccountAvatar(ev) {
	selectFile(ev.currentTarget ?? ev.target, i18n.ts.avatar).then(async (file) => {
		let originalOrCropped = file;

		const { canceled } = await os.confirm({
			type: 'question',
			text: i18n.ts.cropImageAsk,
			okText: i18n.ts.cropYes,
			cancelText: i18n.ts.cropNo,
		});

		if (!canceled) {
			originalOrCropped = await os.cropImage(file, {
				aspectRatio: 1,
			});
		}

		const proxy = await os.apiWithDialog('admin/update-proxy-account', {
			avatarId: originalOrCropped.id,
		});
		proxyAccount.value.avatarId = proxy.avatarId;
		proxyAccount.value.avatarUrl = proxy.avatarUrl;
		globalEvents.emit('requestClearPageCache');
	});
}

function changeProxyAccountBanner(ev) {
	selectFile(ev.currentTarget ?? ev.target, i18n.ts.banner).then(async (file) => {
		let originalOrCropped = file;

		const { canceled } = await os.confirm({
			type: 'question',
			text: i18n.ts.cropImageAsk,
			okText: i18n.ts.cropYes,
			cancelText: i18n.ts.cropNo,
		});

		if (!canceled) {
			originalOrCropped = await os.cropImage(file, {
				aspectRatio: 2,
			});
		}

		const proxy = await os.apiWithDialog('admin/update-proxy-account', {
			bannerId: originalOrCropped.id,
		});
		proxyAccount.value.bannerId = proxy.bannerId;
		proxyAccount.value.bannerUrl = proxy.bannerUrl;
		globalEvents.emit('requestClearPageCache');
	});
}

function chooseProxyAccount() {
	os.selectUser({ localOnly: true }).then(user => {
		proxyAccount.value = user;
		os.apiWithDialog('admin/update-meta', {
			proxyAccountId: user.id,
		}).then(() => {
			fetchInstance(true);
		});
	});
}
</script>

<style lang="scss" module>
.subCaption {
	font-size: 0.85em;
	color: var(--MI_THEME-fgTransparentWeak);
}

.banner {
	position: relative;
	height: 130px;
	background-size: cover;
	background-position: center;
	border-bottom: solid 1px var(--MI_THEME-divider);
	overflow: clip;
}

.avatarContainer {
	margin-top: -50px;
	padding-bottom: 16px;
	text-align: center;
}

.avatar {
	display: inline-block;
	width: 72px;
	height: 72px;
	margin: 0 auto 16px auto;
}

.bannerEdit {
	position: absolute;
	top: 16px;
	right: 16px;
}

</style>
