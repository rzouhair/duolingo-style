import { defineStore } from 'pinia'
import type { Exercise, Option, OptionsTask, SaveAnswerPayload, Task, TypeInTask } from '~/lib/types'

export const useExerciseStore = defineStore('exercise', () => {
  const exercise = ref<Exercise | null>(null)

  const currentScore = ref<number>(0)
  const tasksAnswers = ref<(string | string[])[]>([])

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

  async function loadExercise(id: string): Promise<Exercise | undefined> {
    try {
      const initialResponse = await fetch(`${import.meta.env.VITE_BASE_API_URL}/exercise?id=${id}`)
      const res = await initialResponse.json()

      const output = {
        id,
        instructions: 'Complete each of the sentences below using a past progressive form of a verb',
        tasks: res.phrases.map((phrase: { item: string, key: string | string[] }): TypeInTask => ({
          type: 'type-in',
          content: phrase.item.replace('___', ' % '),
          correctOptions: typeof phrase.key === 'string' ? [phrase.key] : [...phrase.key],
        })) as TypeInTask[],
      }
      return output as Exercise
    }
    catch (error: any) {
      console.error(`An error occurred: ${error.message}`)
    }

    /*     return new Promise((resolve) => {
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
    }) */
  }

  async function saveExercise(id: string, payload: SaveAnswerPayload): Promise<void> {
    try {
      await fetch(`${import.meta.env.VITE_BASE_API_URL}/save-answers`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    }
    catch (error: any) {
      console.error(`An error occurred: ${error.message}`)
    }

    /*     return new Promise((resolve) => {
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
    }) */
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
    tasksAnswers,

    loadExercise,
    saveUserProgress,
    saveExercise,
  }
})
