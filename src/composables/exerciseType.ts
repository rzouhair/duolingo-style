import { defineProps } from 'vue'
import { useExerciseStore } from '~/stores/exercises'

export function useExerciseType<T>() {
  const props = defineProps({
    isCorrect: Boolean,
    isFormFilled: Boolean,
  })

  const exerciseStore = useExerciseStore()

  const task = computed<T | undefined>(() => exerciseStore.currentTask as T)

  return {
    task,
    exerciseStore,
    props,
  }
}
