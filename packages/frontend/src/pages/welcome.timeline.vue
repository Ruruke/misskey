<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div :class="$style.root">
	<div ref="scrollEl" :class="[$style.scrollbox, { [$style.scroll]: isScrolling }]">
		<div v-for="note in notes" :key="note.id" :class="$style.note">
			<div class="_panel" :class="$style.content">
				<div>
					<MkA v-if="note.replyId" class="reply" :to="`/notes/${note.replyId}`"><i class="ti ti-arrow-back-up"></i></MkA>
					<Mfm v-if="note.text" :text="note.text" :author="note.user"/>
					<MkA v-if="note.renoteId" class="rp" :to="`/notes/${note.renoteId}`">RN: ...</MkA>
				</div>
				<div v-if="note.files.length > 0" :class="$style.richcontent">
					<MkMediaList :mediaList="note.files" :user="note.user"/>
				</div>
				<div v-if="note.poll">
					<MkPoll :noteId="note.id" :poll="note.poll" :readOnly="true"/>
				</div>
			</div>
			<MkReactionsViewer ref="reactionsViewer" :note="note"/>
		</div>
	</div>
</div>
</template>

<script lang="ts" setup>
import * as Misskey from 'misskey-js';
import { onUpdated, ref, shallowRef } from 'vue';
import XNote from '@/pages/welcome.timeline.note.vue';
import { misskeyApiGet } from '@/scripts/misskey-api.js';
import { getScrollContainer } from '@@/js/scroll.js';

const notes = ref<Misskey.entities.Note[]>([]);
const isScrolling = ref(false);
const scrollState = ref<null | 'intro' | 'loop'>(null);
const notesMainContainerEl = shallowRef<HTMLElement>();

misskeyApiGet('notes/featured').then(_notes => {
	notes.value = _notes;
});

function changeScrollState() {
	if (scrollState.value !== 'loop') {
		scrollState.value = 'loop';
	}
}

onUpdated(() => {
	if (!notesMainContainerEl.value) return;
	const container = getScrollContainer(notesMainContainerEl.value);
	const containerHeight = container ? container.clientHeight : window.innerHeight;
	if (notesMainContainerEl.value.offsetHeight > containerHeight) {
		if (scrollState.value === null) {
			scrollState.value = 'intro';
		}
		isScrolling.value = true;
	}
});
</script>

<style lang="scss" module>
@keyframes scrollIntro {
	0% {
		transform: translate3d(0, 0, 0);
	}
	100% {
		transform: translate3d(0, calc(calc(-100% - 128px) - var(--MI-margin)), 0);
	}
}

@keyframes scrollConstant {
	0% {
		transform: translate3d(0, -128px, 0);
	}
	100% {
		transform: translate3d(0, calc(calc(-100% - 128px) - var(--MI-margin)), 0);
	}
}

.root {
	text-align: right;
}

.scrollBoxMain {
	&.scrollIntro {
		animation: scrollIntro 30s linear forwards;
	}
	&.scrollLoop {
		animation: scrollConstant 30s linear infinite;
	}
}

.scrollBoxSub {
	&.scrollIntro {
		animation: scrollIntro 30s linear forwards;
	}
	&.scrollLoop {
		animation: scrollConstant 30s linear infinite;
	}
}

.root:has(.note:hover) .scrollBoxMain,
.root:has(.note:hover) .scrollBoxSub {
	animation-play-state: paused;
}
</style>
