import clsx from 'clsx'
import type { ComponentProps } from 'react'

// pathLength=1 lets every stroke be drawn in and out with a 1-long dash, whatever its real length
const STROKE_CLASS_NAME = 'transition-[stroke-dashoffset] duration-300 [stroke-dasharray:1]'
const WAVE_CLASS_NAME = clsx(
  STROKE_CLASS_NAME,
  '[stroke-dashoffset:1] group-aria-pressed:[stroke-dashoffset:0]'
)
const CROSS_CLASS_NAME = clsx(
  STROKE_CLASS_NAME,
  '[stroke-dashoffset:0] group-aria-pressed:delay-0 group-aria-pressed:[stroke-dashoffset:1]'
)

// Lives in a `group` button with aria-pressed: the cross retracts and the waves grow one by one
// when it turns on, the waves retract and the cross is drawn when it turns off
export const SoundIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width='1em'
    height='1em'
    viewBox='0 0 18 18'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    {...props}
  >
    <path d='M2 6.5h3L9.5 3v12L5 11.5H2z' fill='currentColor' stroke='none' />
    <path
      pathLength={1}
      d='M11.5 6.5a3 3 0 0 1 0 5'
      className={clsx(WAVE_CLASS_NAME, 'group-aria-pressed:delay-150')}
    />
    <path
      pathLength={1}
      d='M13.5 4.5a6 6 0 0 1 0 9'
      className={clsx(WAVE_CLASS_NAME, 'group-aria-pressed:delay-250')}
    />
    <path pathLength={1} d='M12 6.5l4.5 5' className={clsx(CROSS_CLASS_NAME, 'delay-200')} />
    <path pathLength={1} d='M16.5 6.5l-4.5 5' className={clsx(CROSS_CLASS_NAME, 'delay-300')} />
  </svg>
)
