<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkContainer :max-height="300" :foldable="true" :onUnfold="unfoldContainer">
	<template #icon><i class="ti ti-photo"></i></template>
	<template #header>{{ i18n.ts.files }}</template>
	<div :class="$style.root">
		<MkLoading v-if="fetching"/>
		<div v-if="!fetching && medias.length > 0" :class="$style.stream">
			<template v-for="media in medias" :key="media.note.id + media.file.id">
				<MkA :to="notePage(media.note)">
					<XVideo v-if="media.file.type.startsWith('video')" :key="`video:${media.file.id}`" :class="$style.media" :video="media.file" :videoControls="false"/>
					<XImage v-else-if="media.file.type.startsWith('image')" :key="`image:${media.file.id}`" :class="$style.media" class="image" :data-id="media.file.id" :image="media.file" :disableImageLink="true"/>
					<XBanner v-else :media="media.file" :user="user"/>
				</MkA>
			</template>
		</div>
		<p v-if="!fetching && notes.length == 0" :class="$style.empty">{{ i18n.ts.nothing }}</p>
	</div>
</MkContainer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import * as Misskey from 'misskey-js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import MkContainer from '@/components/MkContainer.vue';
import { i18n } from '@/i18n.js';
import MkNoteMediaGrid from '@/components/MkNoteMediaGrid.vue';

const props = defineProps<{
	user: Misskey.entities.UserDetailed;
}>();

const emit = defineEmits<{
	(ev: 'unfold'): void;
}>();

const fetching = ref(true);
const notes = ref<Misskey.entities.Note[]>([]);

function unfoldContainer(): boolean {
	emit('unfold');
	return false;
}

onMounted(() => {
	misskeyApi('users/notes', {
		userId: props.user.id,
		withFiles: true,
		limit: 10,
	}).then(_notes => {
		notes.value = _notes;
		fetching.value = false;
	});
});
</script>

<style lang="scss" module>
.root {
	padding: 8px;
}

.stream {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	grid-gap: 6px;
}

.img {
	position: relative;
	height: 128px;
	border-radius: 6px;
	overflow: clip;
}

.empty {
	margin: 0;
	padding: 16px;
	text-align: center;
}

.sensitiveImg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	filter: brightness(0.7);
}
.sensitive {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: grid;
  place-items: center;
	font-size: 0.8em;
	color: #fff;
	cursor: pointer;
}
</style>
