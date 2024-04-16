<script setup lang="ts">
import type { TypeInTask } from '~/lib/types'

const emit = defineEmits(['update:is-correct', 'update:is-form-filled'])

const {
  task,
  exerciseStore,
} = useExerciseType<TypeInTask>()

const taskAnswers = ref<string[]>([])
const isFormFilled = computed(() => taskAnswers.value.length > 0 && taskAnswers.value.every(answer => answer.length > 0))

const splitContent = computed(() => task.value?.content.split('%'))

const placeholdersMap = computed(() => {
  const indexesMap: Record<number, number> = {}

  splitContent.value?.forEach((portion: string, i: number) => {
    if (splitContent.value && i !== splitContent.value?.length - 1)
      indexesMap[i] = Object.keys(indexesMap).length
  })

  return indexesMap
})

const maxOptionCharactersCount = computed(() => {
  const charCountMap: Record<number, number> = {}
  task.value?.correctOptions?.forEach((option: string, i: number) => {
    charCountMap[i] = option.length
  })
  return charCountMap
})

watch(() => taskAnswers.value, () => {
  emit('update:is-correct', taskAnswers.value.every((answer, i) => task.value?.correctOptions && answer.trim().toLowerCase() === task.value?.correctOptions[i].toLowerCase()))

  emit('update:is-form-filled', isFormFilled.value)
}, {
  immediate: true,
  deep: true,
})

watch(() => exerciseStore.currentTaskIndex, () => {
  resetTaskAnswers()
}, { immediate: true })

function resetTaskAnswers() {
  if (task.value?.correctOptions)
    taskAnswers.value = Array(task.value?.correctOptions.length).fill('')
}
</script>

<template>
  <div>
    <div>
      <template v-for="(portion, i) in splitContent" :key="i">
        {{ portion }}
        <span v-if="splitContent && i !== splitContent?.length - 1">
          <input
            v-model="taskAnswers[placeholdersMap[i]]"
            class="border-b border-slate-800 text-green-500 focus-visible:outline-0"
            :style="{ width: `${maxOptionCharactersCount[placeholdersMap[i]]}ch` }"
          >
        </span>
      </template>
    </div>
  </div>
</template>
