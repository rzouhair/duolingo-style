import { type VariantProps, cva } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-white border-slate-200 hover:bg-slate-100 border-2 border-b-4 active:border-b-2',
        primary: 'bg-green-400 border-green-500 hover:bg-green-400/80 text-white border-2 border-b-4 active:border-b-2',
        danger: 'bg-red-500 border-red-600 hover:bg-red-500/80 text-white border-2 border-b-4 active:border-b-2',
        info: 'bg-blue-500 border-blue-600 hover:bg-blue-500/80 text-white border-2 border-b-4 active:border-b-2',
        disabled: 'bg-slate-100 border-slate-200 border-2 pointer-events-none select-none opacity-50 cursor-not-allowed',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
        rounded: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
