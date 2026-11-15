import clsx from 'clsx'

const HANDLE_CLASS_NAME = 'absolute size-[7px] border border-frame bg-white'
const CORNER_CLASS_NAMES = [
  'top-0 left-0 -translate-1/2',
  'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  'right-0 bottom-0 translate-1/2'
] as const

interface LensSelectionFrameProps {
  label: string
}

// A design tool's selection: a thin blue frame with corner handles and the layer's name above it,
// shown while its control is hovered or held
export const LensSelectionFrame = ({ label }: LensSelectionFrameProps) => (
  <div className='pointer-events-none absolute inset-0 border-[1.5px] border-frame opacity-0 transition-opacity duration-200 group-hover/frame:opacity-100 group-active/frame:opacity-100'>
    {CORNER_CLASS_NAMES.map(corner => (
      <span key={corner} className={clsx(HANDLE_CLASS_NAME, corner)} />
    ))}
    <span className='absolute bottom-full left-[-1.5px] mb-[4px] rounded-[2px] bg-frame px-[4px] text-[max(10px,calc(11*var(--text-unit)))] leading-[1.4] font-medium whitespace-nowrap text-white'>
      {label}
    </span>
  </div>
)
