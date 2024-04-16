export interface Exercise {
  id: string
  instructions: string
  tasks: Task[]
}

export interface TypedTask {
  content: string
  type: 'type-in' | 'options'
}

export interface Option {
  text: string
  isCorrect: boolean
}

export type OptionsTask = TypedTask & { type: 'options', options: Option[] }
export type TypeInTask = TypedTask & { type: 'type-in', correctOptions: string[] }

export type Task = OptionsTask | TypeInTask
