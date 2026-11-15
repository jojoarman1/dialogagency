import type { ComponentProps } from 'react'

export const CheckIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width='1em'
    height='1em'
    viewBox='0 0 16 16'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    {...props}
  >
    <path pathLength={1} d='M3.5 8.5l3 3 6-7' />
  </svg>
)
