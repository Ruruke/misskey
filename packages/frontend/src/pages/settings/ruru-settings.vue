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

			<MkSwitch v-model="hidePublicNotes" @update:modelValue="save_privacy()">
				{{ i18n.ts.hidePublicNotes }}<span class="_beta">{{ i18n.ts.originalFeature }}</span>
				<template #caption>{{ i18n.ts.hidePublicNotesDescription }}</template>
			</MkSwitch>
			<MkSwitch v-model="hideHomeNotes" @update:modelValue="save_privacy()">
				{{ i18n.ts.hideHomeNotes }}<span class="_beta">{{ i18n.ts.originalFeature }}</span>
				<template #caption>{{ i18n.ts.hideHomeNotesDescription }}</template>
			</MkSwitch>
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
			<MkSwitch v-model="useTextAreaAutoSize">
				<template #caption>{{ i18n.ts.textAreaAutoResizeDescription }}</template>
				{{ i18n.ts.textAreaAutoResize }}
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
	<FormSection>
		<template #label>{{ i18n.ts.drive }}</template>
		<div class="_gaps_m">
			<div class="_gaps_s">
				<MkSelect v-model="imageCompressionMode">
					<template #label>{{ i18n.ts._imageCompressionMode.title }}<span class="_beta">{{ i18n.ts.originalFeature }}</span></template>
					<option value="resizeCompress">{{ i18n.ts._imageCompressionMode.resizeCompress }}</option>
					<option value="noResizeCompress">{{ i18n.ts._imageCompressionMode.noResizeCompress }}</option>
					<option value="resizeCompressLossy">{{ i18n.ts._imageCompressionMode.resizeCompressLossy }}</option>
					<option value="noResizeCompressLossy">{{ i18n.ts._imageCompressionMode.noResizeCompressLossy }}</option>
					<template #caption>{{ i18n.ts._imageCompressionMode.description }}</template>
				</MkSelect>
			</div>
		</div>
	</FormSection>
</div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import * as Misskey from 'misskey-js';
import { defineAsyncComponent, ref } from 'vue';
import MkInput from '@/components/MkInput.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import MkSelect from '@/components/MkSelect.vue';
import MkFolder from '@/components/MkFolder.vue';
import MkButton from '@/components/MkButton.vue';
import FormSection from '@/components/form/section.vue';
import FromSlot from '@/components/form/slot.vue';
import MkCustomEmoji from '@/components/global/MkCustomEmoji.vue';
import MkEmoji from '@/components/global/MkEmoji.vue';
import { store } from '@/store.js';
import * as os from '@/os.js';
import { reloadAsk } from '@/utility/reload-ask.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/page.js';
import { fontList } from '@/utility/font';
import MkSparkle from '@/components/MkSparkle.vue';
import MkContainer from '@/components/MkContainer.vue';
import MkDeleteScheduleEditor from '@/components/MkDeleteScheduleEditor.vue';
import { bottomItemDef } from '@/utility/post-form.js';
import { signinRequired } from '@/account.js';
import { globalEvents } from '@/events.js';
import { misskeyApi } from '@/utility/misskey-api.js';
import MkNote from '@/components/MkNote.vue';

const $i = signinRequired();
const selectReaction = computed(store.makeGetterSetter('selectReaction'));
const disableNoteNyaize = computed(store.makeGetterSetter('disableNoteNyaize'));
const customFont = computed(store.makeGetterSetter('customFont'));
const useNoteVisibilityColoring = computed(store.makeGetterSetter('useNoteVisibilityColoring'));
const noteVisibilityColorHome = computed(store.makeGetterSetter('noteVisibilityColorHome'));
const noteVisibilityColorFollowers = computed(store.makeGetterSetter('noteVisibilityColorFollowers'));
const noteVisibilityColorSpecified = computed(store.makeGetterSetter('noteVisibilityColorSpecified'));
const noteVisibilityColorLocalOnly = computed(store.makeGetterSetter('noteVisibilityColorLocalOnly'));
const noteVisibilityColorChanged = ref(false);
const useTextAreaAutoSize = computed(store.makeGetterSetter('useTextAreaAutoSize'));
const imageCompressionMode = computed(store.makeGetterSetter('imageCompressionMode'));
const hidePublicNotes = ref($i.hidePublicNotes);
const hideHomeNotes = ref($i.hideHomeNotes);

watch([
	noteVisibilityColorHome,
	noteVisibilityColorFollowers,
	noteVisibilityColorSpecified,
	noteVisibilityColorLocalOnly,
], () => {
	noteVisibilityColorChanged.value = true;
});
watch([
	customFont,
	disableNoteNyaize,
	useTextAreaAutoSize,
	imageCompressionMode,
], async () => {
	await reloadAsk({ reason: i18n.ts.reloadToApplySetting, unison: true });
});

function saveColors() {
	if (noteVisibilityColorChanged.value) {
		store.set('noteVisibilityColorHome', noteVisibilityColorHome.value);
		store.set('noteVisibilityColorFollowers', noteVisibilityColorFollowers.value);
		store.set('noteVisibilityColorSpecified', noteVisibilityColorSpecified.value);
		store.set('noteVisibilityColorLocalOnly', noteVisibilityColorLocalOnly.value);
		noteVisibilityColorChanged.value = false;
	}
}

function save_privacy() {
	misskeyApi('i/update', {
		hidePublicNotes: !!hidePublicNotes.value,
		hideHomeNotes: !!hideHomeNotes.value,
	});
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

const disableNoteDrafting = computed(store.makeGetterSetter('disableNoteDrafting'));
const draftSavingBehavior = computed(store.makeGetterSetter('draftSavingBehavior'));
const defaultScheduledNoteDelete = computed(store.makeGetterSetter('defaultScheduledNoteDelete'));

const scheduledNoteDelete = ref({ deleteAt: null, deleteAfter: store.s.defaultScheduledNoteDeleteTime, isValid: true });

watch(scheduledNoteDelete, () => {
	if (!scheduledNoteDelete.value.isValid) return;
	store.set('defaultScheduledNoteDeleteTime', scheduledNoteDelete.value.deleteAfter);
});

const Sortable = defineAsyncComponent(() => import('vuedraggable').then(x => x.default));

const items = ref(store.s.postFormActions.map(x => ({
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
	store.set('postFormActions', items.value.map(x => x.type));
}

async function reset() {
	const result = await os.confirm({
		type: 'warning',
		text: i18n.ts.resetAreYouSure,
	});
	if (result.canceled) return;

	items.value = store.def.postFormActions.default.map(x => ({
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
