<script setup lang="ts">
import { useExerciseStore } from '~/stores/exercises'

const exerciseStore = useExerciseStore()

const score = computed(() => exerciseStore.currentScore)
const tasksCount = computed(() => exerciseStore.exercise?.tasks.length)

function close() {

}
</script>

<template>
  <div class="h-full w-full flex flex-col p-6">
    <Progress :model-value="100" />

    <div class="flex flex-1 flex-col items-start justify-center text-left">
      <i class="i-tabler-mood-happy-filled mx-auto mb-12 text-[120px] text-green-500" />
      <h2 class="mb-2 font-bold">
        Wonderful!
      </h2>
      <p>You've completed {{ score }} out of {{ tasksCount }}!</p>
    </div>

    <Button size="lg" variant="primary" class="w-full" @click="close">
      Close
    </Button>
  </div>
</template>
