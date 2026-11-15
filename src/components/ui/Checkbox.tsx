import clsx from 'clsx'
import type { ComponentProps } from 'react'

import { CheckIcon } from '@/components/icon/CheckIcon'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

// The real input stays on top, transparent, so clicks, keyboard and screen readers work as usual.
// The box takes the text colour, so it fits light and dark surfaces alike; the mark is the inverse
export const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <span
    className={clsx(
      'group relative inline-flex shrink-0 transition-[scale] duration-600 ease-spring active:scale-85 active:duration-100 active:ease-out',
      className
    )}
  >
    <input
      type='checkbox'
      className='peer absolute inset-0 m-0 size-full cursor-pointer appearance-none'
      {...props}
    />
    <span
      aria-hidden='true'
      className='pointer-events-none flex size-full items-center justify-center rounded-[calc(3*var(--text-unit))] border border-current/50 transition-colors duration-300 group-hover:border-current peer-checked:border-current peer-checked:bg-current peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-current'
    >
      <CheckIcon className='size-full invert transition-[stroke-dashoffset] duration-300 [stroke-dasharray:1] [stroke-dashoffset:1] group-has-checked:delay-100 group-has-checked:[stroke-dashoffset:0]' />
    </span>
  </span>
)
