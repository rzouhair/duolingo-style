<script setup lang="ts" generic="T extends any, O extends any">
import Progress from '~/components/ui/progress/Progress.vue'
import ExerciseOptions from '~/components/exercise/ExerciseOptions.vue'
import ExerciseTypeIn from '~/components/exercise/ExerciseTypeIn.vue'
import { useExerciseStore } from '~/stores/exercises'
import type { Exercise, OptionsTask, TypeInTask } from '~/lib/types'

defineOptions({
  name: 'IndexPage',
})

const route = useRoute()

const loading = ref<boolean>(false)

const exerciseStore = useExerciseStore()
const progress = computed(() => exerciseStore.progressPercentage)

const exerciseId = computed(() => route.query.id?.toString())

const isCurrentTaskCorrect = ref<boolean>(false)
const isFormFilled = ref<boolean>(false)

async function checkTaskAnswer() {
  if (isFormFilled.value) {
    if (!exerciseStore.checking) {
      exerciseStore.isCurrentTaskCorrect = isCurrentTaskCorrect.value
      exerciseStore.checking = true
      if (isCurrentTaskCorrect.value)
        exerciseStore.currentScore += 1
    }
    else {
      exerciseStore.checking = false
      if (exerciseStore.exercise && exerciseStore.currentTaskIndex + 1 < exerciseStore.exercise.tasks.length) {
        exerciseStore.currentTaskIndex += 1
      }
      else {
        if (exerciseId.value) {
          if (exerciseStore.exercise) {
            const payload = exerciseStore.tasksAnswers.map((answer, taskIndex) => {
              const task = (exerciseStore.exercise as Exercise).tasks[taskIndex]
              return {
                template: task?.content,
                userAnswer: answer,
                key: task?.type === 'type-in'
                  ? (task as TypeInTask).correctOptions
                  : (task as OptionsTask).options.map(o => o.text),
              }
            })
            exerciseStore.saveExercise(exerciseId.value, {
              answers: payload,
              exerciseId: exerciseId.value,
            })
          }
        }
        exerciseStore.showingSummary = true
      }
    }
  }
}

const exerciseComponentMap = ref({
  'type-in': ExerciseTypeIn,
  'options': ExerciseOptions,
})

onBeforeMount(async () => {
  try {
    loading.value = true
    const res: Exercise | undefined = await exerciseStore.loadExercise(exerciseId.value || 'some-id')
    // const res: Exercise = await exerciseStore.loadExercise('some-id')

    if (res) {
      exerciseStore.exercise = res
      exerciseStore.tasksAnswers = res.tasks.map(task => task.type === 'type-in' ? [''] : '')
    }
  }
  catch {
    console.error('An error occurred')
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="mx-auto h-full max-w-screen-md flex flex-col items-center gap-4">
    <ExerciseSummary v-if="exerciseStore.showingSummary" />
    <template v-else>
      <div class="w-full flex-1 p-6">
        <Progress v-model="progress" />

        <ExerciseSkeleton v-if="loading" />
        <template v-else>
          <div class="my-4 w-full text-left font-bold">
            <h2>Fill in the gaps</h2>
          </div>
          <div v-if="exerciseStore.currentTask" class="h-full flex-1">
            <component
              :is="exerciseComponentMap[exerciseStore.currentTask?.type]"
              v-model:is-correct="isCurrentTaskCorrect"
              v-model:is-form-filled="isFormFilled"
            />
          </div>
        </template>
      </div>

      <template v-if="loading">
        <div class="w-full p-6">
          <Skeleton class="h-[44px] w-full rounded-xl" />
        </div>
      </template>

      <ExerciseFooter v-else :disabled="!isFormFilled" @on-check-clicked="checkTaskAnswer">
        <div v-if="exerciseStore.checking && !exerciseStore.isCurrentTaskCorrect" class="mt-4 border-t border-white/20 pt-4 text-white">
          <h2 class="mb-2 font-bold">
            Correct answer:
          </h2>
          <p v-html="exerciseStore.correctTaskString " />
        </div>
      </ExerciseFooter>
    </template>
  </div>
</template>
