<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<MkModalWindow
		ref="windowEl"
		:withOkButton="false"
		:okButtonDisabled="false"
		:width="400"
		:height="500"
		@close="onCloseModalWindow"
		@closed="emit('closed')"
	>
		<template #header>{{ title }}</template>
		<MkSpacer :marginMin="20" :marginMax="28">
			<MkLoading v-if="fetching"/>
			<div v-else class="_gaps" :class="$style.root">
				<div :class="$style.header">
					<MkButton rounded @click="addRole"><i class="ti ti-plus"></i> {{ i18n.ts.add }}</MkButton>
				</div>

				<div v-if="selectedRoles.length > 0" class="_gaps" :class="$style.roleItemArea">
					<div v-for="role in selectedRoles" :key="role.id" :class="$style.roleItem">
						<MkRolePreview :class="$style.role" :role="role" :forModeration="true" :detailed="false" style="pointer-events: none;"/>
						<button class="_button" :class="$style.roleUnAssign" @click="removeRole(role.id)"><i class="ti ti-x"></i></button>
					</div>
				</div>
				<div v-else :class="$style.roleItemArea" style="text-align: center">
					{{ i18n.ts._roleSelectDialog.notSelected }}
				</div>

				<MkInfo v-if="infoMessage">{{ infoMessage }}</MkInfo>

				<div :class="$style.buttons">
					<MkButton primary @click="onOkClicked">{{ i18n.ts.ok }}</MkButton>
					<MkButton @click="onCancelClicked">{{ i18n.ts.cancel }}</MkButton>
				</div>
			</div>
		</MkSpacer>
	</MkModalWindow>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import * as Misskey from 'misskey-js';
import MkRolePreview from '@/components/MkRolePreview.vue';
import MkFoldableSection from '@/components/MkFoldableSection.vue';
import { i18n } from '@/i18n.js';
import { misskeyApi } from '@/utility/misskey-api.js';
import * as os from '@/os.js';
import MkSpacer from '@/components/global/MkSpacer.vue';
import MkModalWindow from '@/components/MkModalWindow.vue';
import MkLoading from '@/components/global/MkLoading.vue';

const emit = defineEmits<{
	(ev: 'done', value: Misskey.entities.Role[]),
	(ev: 'close'),
	(ev: 'closed'),
}>();

const props = withDefaults(defineProps<{
	initialRoleIds?: string[],
	infoMessage?: string,
	title?: string,
	publicOnly: boolean,
}>(), {
	initialRoleIds: undefined,
	infoMessage: undefined,
	title: undefined,
	publicOnly: true,
});

const { initialRoleIds, infoMessage, title, publicOnly } = toRefs(props);

const windowEl = ref<InstanceType<typeof MkModalWindow>>();
const roles = ref<Misskey.entities.Role[]>([]);
const selectedRoleIds = ref<string[]>(initialRoleIds.value ?? []);
const fetching = ref(false);

const rolesManual = ref<Misskey.entities.Role[] | null>(null);
const rolesConditional = ref<Misskey.entities.Role[] | null>(null);
const rolesCommunity = ref<Misskey.entities.Role[] | null>(null);

misskeyApi('roles/list').then(res => {
	const roles = res.sort((a, b) => b.displayOrder - a.displayOrder);
	rolesManual.value = roles.filter(x => x.target === 'manual' && x.permissionGroup !== 'Community');
	rolesConditional.value = roles.filter(x => x.target === 'conditional' && x.permissionGroup !== 'Community');
	rolesCommunity.value = roles.filter(x => x.permissionGroup === 'Community');
});
</script>

<style module lang="scss">
.root {
	max-height: 410px;
	height: 410px;
	display: flex;
	flex-direction: column;
}

.roleItemArea {
	background-color: color(from var(--MI_THEME-bg) srgb r g b / 0.5);
	border-radius: var(--MI-radius);
	padding: 12px;
	overflow-y: auto;
}
.roleGrid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	grid-gap: var(--margin);
}
</style>
