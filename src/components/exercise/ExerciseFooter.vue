<script setup lang="ts">
import { useExerciseStore } from '~/stores/exercises'

defineProps({
  disabled: Boolean,
})

defineEmits(['onCheckClicked'])

const exerciseStore = useExerciseStore()

const state = computed<'correct' | 'incorrect' | 'default'>(() => {
  if (exerciseStore.checking) {
    if (exerciseStore.isCurrentTaskCorrect)
      return 'correct'
    else
      return 'incorrect'
  }
  return 'default'
})

const stateVariants: Record<string, {
  bg?: string
  icon?: string
  text?: string
  variant: 'primary' | 'danger' | 'default' | 'disabled' | 'info' | null
  btnText: string
}> = {
  default: {
    variant: 'default',
    btnText: 'Check',
  },
  correct: {
    bg: 'bg-green-300',
    icon: 'i-tabler-circle-check-filled',
    text: 'Correct',
    variant: 'primary',
    btnText: 'Continue',
  },
  incorrect: {
    bg: 'bg-red-400',
    icon: 'i-tabler-circle-x-filled text-red-600',
    text: 'Incorrect',
    variant: 'danger',
    btnText: 'Got it',
  },
}
</script>

<template>
  <div class="w-full px-6 pb-6 pt-4" :class="[stateVariants[state].bg]">
    <div class="flex items-center gap-2 text-white">
      <i class="text-2xl" :class="stateVariants[state].icon" />
      <p class="text-lg font-bold">
        {{ stateVariants[state].text }}
      </p>
    </div>
    <div v-if="!disabled" class="my-2">
      <slot />
    </div>
    <Button class="mt-2 w-full" size="lg" :disabled="disabled" :variant="stateVariants[state].variant" @click="!disabled && $emit('onCheckClicked')">
      {{ stateVariants[state].btnText }}
    </Button>
  </div>
</template>
