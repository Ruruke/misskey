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
			<MkSwitch v-model="disableNoteNyaize">{{ i18n.ts.disableNoteNyaize }}<span class="_beta">{{ i18n.ts.originalFeature }}</span><span class="_beta">{{ i18n.ts._featureBy.shafu }}</span></MkSwitch>
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

	<MkFolder>
		<template #icon><i class="ti ti-forms"></i></template>
		<template #label>{{ i18n.ts.postForm }}<span class="_beta">{{ i18n.ts.originalFeature }}</span></template>
		<div class="_gaps_m">
			<FormSlot>
				<template #label>{{ i18n.ts.postForm }}<span class="_beta">{{ i18n.ts.originalFeature }}</span></template>
				<MkContainer :showHeader="false">
					<Sortable
						v-model="items"
						:class="$style.items"
						:itemKey="items => items"
						:animation="100"
						:delay="50"
						:delayOnTouchOnly="true"
					>
						<template #item="{element}">
							<button v-tooltip="bottomItemDef[element.type].title" class="_button" :class="$style.item" @click="removeItem(element.type, $event)">
								<i class="ti ti-fw" :class="[$style.itemIcon, bottomItemDef[element.type].icon]"></i>
							</button>
						</template>
					</Sortable>
				</MkContainer>
			</FormSlot>
			<div class="_buttons">
				<MkButton @click="addItem"><i class="ti ti-plus"></i> {{ i18n.ts.addItem }}</MkButton>
				<MkButton danger @click="reset"><i class="ti ti-reload"></i> {{ i18n.ts.default }}</MkButton>
				<MkButton primary class="save" @click="save"><i class="ti ti-device-floppy"></i> {{ i18n.ts.save }}</MkButton>
			</div>
			<div :class="$style.label">{{ i18n.ts.postFormBottomSettingsDescription }}</div>
			<MkSelect v-model="draftSavingBehavior">
				<template #label>{{ i18n.ts.draftSavingBehavior }}<span class="_beta">{{ i18n.ts.originalFeature }}</span></template>
				<option value="auto">{{ i18n.ts._draftSavingBehavior.auto }}</option>
				<option value="manual">{{ i18n.ts._draftSavingBehavior.manual }}</option>
			</MkSelect>
			<MkSwitch v-model="disableNoteDrafting">
				<template #caption>{{ i18n.ts.disableNoteDraftingDescription }}</template>
				{{ i18n.ts.disableNoteDrafting }}
				<span class="_beta">{{ i18n.ts.originalFeature }}</span>
			</MkSwitch>
			<div>
				<div :class="$style.label">
					{{ i18n.ts.defaultScheduledNoteDeleteTime }}
					<span class="_beta">{{ i18n.ts.originalFeature }}</span>
				</div>
				<MkDeleteScheduleEditor v-model="scheduledNoteDelete" :afterOnly="true"/>
			</div>
			<MkSwitch v-model="defaultScheduledNoteDelete">
				{{ i18n.ts.defaultScheduledNoteDelete }}
				<span class="_beta">{{ i18n.ts.originalFeature }}</span>
			</MkSwitch>
		</div>
	</MkFolder>
	<MkFolder open>
		<template #label><i class="ti ti-tag"/> 公開範囲に応じた色分け</template>
		<div class="_panel _padding _gaps_m">
			<MkSwitch v-model="useNoteVisibilityColoring">
				公開範囲に応じた色分け
				<template #caption>
					ノートの公開範囲に応じて、特殊な色付き表示を行います。
				</template>
			</MkSwitch>
			<template v-if="useNoteVisibilityColoring">
				<MkColorInput v-model="noteVisibilityColorHome">
					<template #label>{{ i18n.ts._visibility.home }}</template>
				</MkColorInput>
				<MkColorInput v-model="noteVisibilityColorFollowers">
					<template #label>{{ i18n.ts._visibility.followers }}</template>
				</MkColorInput>
				<MkColorInput v-model="noteVisibilityColorSpecified">
					<template #label>{{ i18n.ts._visibility.specified }}</template>
				</MkColorInput>
				<MkColorInput v-model="noteVisibilityColorLocalOnly">
					<template #label>{{ i18n.ts._visibility.public }}（{{ i18n.ts._visibility.disableFederation }}）</template>
				</MkColorInput>
				<MkButton v-if="noteVisibilityColorChanged" primary @click="saveColors"><i class="ti ti-device-floppy"></i> {{ i18n.ts.save }}</MkButton>
			</template>
		</div>
	</MkFolder>
</div>
</template>

<script lang="ts" setup>
import * as Misskey from 'misskey-js';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
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
import MkDeleteScheduleEditor from '@/components/MkDeleteScheduleEditor.vue';
import FormSlot from '@/components/form/slot.vue';
import MkColorInput from '@/components/MkColorInput.vue';
import MkContainer from '@/components/MkContainer.vue';
import { bottomItemDef } from '@/scripts/post-form.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';

const selectReaction = computed(defaultStore.makeGetterSetter('selectReaction'));
const disableNoteNyaize = computed(defaultStore.makeGetterSetter('disableNoteNyaize'));
const customFont = computed(defaultStore.makeGetterSetter('customFont'));
const useNoteVisibilityColoring = computed(defaultStore.makeGetterSetter('useNoteVisibilityColoring'));
const noteVisibilityColorHome = computed(defaultStore.makeGetterSetter('noteVisibilityColorHome'));
const noteVisibilityColorFollowers = computed(defaultStore.makeGetterSetter('noteVisibilityColorFollowers'));
const noteVisibilityColorSpecified = computed(defaultStore.makeGetterSetter('noteVisibilityColorSpecified'));
const noteVisibilityColorLocalOnly = computed(defaultStore.makeGetterSetter('noteVisibilityColorLocalOnly'));
const noteVisibilityColorChanged = ref(false);

watch([
	noteVisibilityColorHome,
	noteVisibilityColorFollowers,
	noteVisibilityColorSpecified,
	noteVisibilityColorLocalOnly,
], () => {
	noteVisibilityColorChanged.value = true;
});

function saveColors() {
	if (noteVisibilityColorChanged.value) {
		defaultStore.set('noteVisibilityColorHome', noteVisibilityColorHome.value);
		defaultStore.set('noteVisibilityColorFollowers', noteVisibilityColorFollowers.value);
		defaultStore.set('noteVisibilityColorSpecified', noteVisibilityColorSpecified.value);
		defaultStore.set('noteVisibilityColorLocalOnly', noteVisibilityColorLocalOnly.value);
		noteVisibilityColorChanged.value = false;
	}
}

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

// postForm

const disableNoteDrafting = computed(defaultStore.makeGetterSetter('disableNoteDrafting'));
const draftSavingBehavior = computed(defaultStore.makeGetterSetter('draftSavingBehavior'));
const defaultScheduledNoteDelete = computed(defaultStore.makeGetterSetter('defaultScheduledNoteDelete'));

const scheduledNoteDelete = ref({ deleteAt: null, deleteAfter: defaultStore.state.defaultScheduledNoteDeleteTime, isValid: true });

watch(scheduledNoteDelete, () => {
	if (!scheduledNoteDelete.value.isValid) return;
	defaultStore.set('defaultScheduledNoteDeleteTime', scheduledNoteDelete.value.deleteAfter);
});

const Sortable = defineAsyncComponent(() => import('vuedraggable').then(x => x.default));

const items = ref(defaultStore.state.postFormActions.map(x => ({
	id: Math.random().toString(),
	type: x,
})));

async function addItem() {
	const currentItems = items.value.map(x => x.type);
	const bottomItem = Object.keys(bottomItemDef).filter(k => !currentItems.includes(k));
	const { canceled, result: item } = await os.select({
		title: i18n.ts.addItem,
		items: bottomItem.map(k => ({
			value: k, text: bottomItemDef[k].title,
		})),
	});
	if (canceled || item == null) return;
	items.value = [...items.value, {
		id: Math.random().toString(),
		type: item,
	}];
}

function removeItem(type: keyof typeof bottomItemDef, ev: MouseEvent) {
	const item = bottomItemDef[type];
	os.popupMenu([{
		type: 'label',
		text: item.title,
	}, {
		text: i18n.ts.remove,
		action: () => {
			items.value = items.value.filter(x => x.type !== type);
		},
	}], getHTMLElement(ev));
}

async function save() {
	defaultStore.set('postFormActions', items.value.map(x => x.type));
}

async function reset() {
	const result = await os.confirm({
		type: 'warning',
		text: i18n.ts.resetAreYouSure,
	});
	if (result.canceled) return;

	items.value = defaultStore.def.postFormActions.default.map(x => ({
		id: Math.random().toString(),
		type: x,
	}));
}

const headerActions = computed(() => []);

const headerTabs = computed(() => []);

definePageMetadata(() => ({
	title: i18n.ts.postForm,
	icon: 'ti ti-pencil',
}));

</script>

<style lang="scss" module>
.items {
	padding: 8px;
	flex: 1;
	display: grid;
	grid-auto-flow: row;
	grid-template-columns: repeat(auto-fill, minmax(42px, 1fr));
	grid-auto-rows: 40px;
}

.item {
	display: inline-block;
	padding: 0;
	margin: 0;
	font-size: 1em;
	width: auto;
	height: 100%;
	border-radius: 6px;

	&:hover {
		background: var(--X5);
	}
}

.label {
	font-size: 0.85em;
	padding: 0 0 8px 0;
	user-select: none;
}
</style>
