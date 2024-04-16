import { defineStore } from 'pinia'
import type { Exercise, Option, OptionsTask, Task, TypeInTask } from '~/lib/types'

export const useExerciseStore = defineStore('exercise', () => {
  const exercise = ref<Exercise | null>(null)

  const currentScore = ref<number>(0)

  const currentTaskIndex = ref<number>(0)
  const progressPercentage = computed<number>(() => {
    if (exercise.value)
      return ((currentTaskIndex.value + 1) * 100) / exercise.value.tasks.length
    else
      return 0
  })

  const currentTask = computed<Task | undefined>(() => exercise.value?.tasks[currentTaskIndex.value])
  const correctTaskString = computed<string | undefined>(() => {
    let output = currentTask.value?.content
    if (currentTask.value?.type === 'type-in') {
      (currentTask.value as TypeInTask | undefined)?.correctOptions?.forEach((option: string) => {
        output = output?.replace('%', `<b>${option}</b>`)
      })
    }
    else {
      output = output?.replace('%', `<b>${(currentTask.value as OptionsTask | undefined)?.options?.find((o: Option) => o.isCorrect)?.text}</b>`)
    }

    return output
  })

  const checking = ref<boolean>(false)
  const showingSummary = ref<boolean>(false)

  const isCurrentTaskCorrect = ref<boolean>(false)

  async function loadExercise(id: string): Promise<Exercise> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          instructions: 'Complete each of the sentences below using a past progressive form of a verb',
          tasks: [
            {
              content: 'I watched this film before, the best % is when the main character realizes its superpower.',
              type: 'options',
              options: [
                { text: 'science', isCorrect: false },
                { text: 'scene', isCorrect: true },
                { text: 'scent', isCorrect: false },
                { text: 'descend', isCorrect: false },
              ],
            },
            {
              content: 'I % (not see) him since we % (be) at school together',
              type: 'type-in',
              correctOptions: [
                'haven\'t seen',
                'were',
              ],
            },
            {
              content: 'How long % (to do) it take you to get good at drawing',
              type: 'type-in',
              correctOptions: [
                'did',
              ],
            },
            {
              content: 'I watched this film before, the best scene is when the main character % its superpower.',
              type: 'options',
              options: [
                { text: 'realized', isCorrect: false },
                { text: 'has realized', isCorrect: false },
                { text: 'realizes', isCorrect: true },
                { text: 'realize', isCorrect: false },
              ],
            },
          ],
        })
      }, 1000)
    })
  }

  async function saveUserProgress() {

  }

  return {
    exercise,
    currentTask,
    currentTaskIndex,
    correctTaskString,
    progressPercentage,
    checking,
    isCurrentTaskCorrect,
    currentScore,
    showingSummary,

    loadExercise,
    saveUserProgress,
  }
})
