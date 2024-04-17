<script setup lang="ts">
import type { Option, OptionsTask } from '~/lib/types'

const emit = defineEmits(['update:is-correct', 'update:is-form-filled'])

const {
  task,
  exerciseStore,
} = useExerciseType<OptionsTask>()

const selectedOption = ref<number | null>(null)
const splitContent = computed(() => task.value?.content.split(' '))

const maxOptionCharactersCount = computed(() => {
  return Math.max(...(task.value?.options?.map((o: Option) => o.text.length) || []))
})

function changeSelection(i: number) {
  selectedOption.value = i
}

watch(selectedOption, () => {
  emit('update:is-correct', selectedOption.value !== null && task.value?.options?.[selectedOption.value].isCorrect)
  emit('update:is-form-filled', selectedOption.value !== null)
  if (selectedOption.value !== null && task.value?.options?.[selectedOption.value].text)
    exerciseStore.tasksAnswers[exerciseStore.currentTaskIndex] = task.value?.options?.[selectedOption.value].text
})

watch(() => exerciseStore.currentTaskIndex, () => {
  resetTaskAnswers()
}, { immediate: true })

function resetTaskAnswers() {
  selectedOption.value = null
}
</script>

<template>
  <div class="h-full w-full flex flex-col gap-4">
    <div>
      <template v-for="(portion, i) in splitContent">
        <template v-if="portion !== '%'">
          {{ portion }}
        </template>
        <template v-else>
          <div
            :key="i"
            value=""
            :style="{ width: `${maxOptionCharactersCount}ch` }"
            :class="{
              'inline-block border-b border-slate-800 focus-visible:outline-0': selectedOption === null,
              'inline-block bg-green-500 text-white rounded-sm text-center': selectedOption !== null,
            }"
          >
            {{ selectedOption !== null ? task?.options?.[selectedOption].text : '' }}
          </div>
        </template>
        &nbsp;
      </template>
    </div>

    <div class="grid grid-cols-2 mb-4 mt-16 gap-2">
      <Button v-for="(option, iOption) in task?.options" :key="iOption" :variant="selectedOption === iOption ? 'primary' : 'default'" @click="changeSelection(iOption)">
        {{ option.text }}
      </Button>
    </div>
  </div>
</template>
