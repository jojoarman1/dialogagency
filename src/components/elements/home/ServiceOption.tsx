import clsx from 'clsx'

interface ServiceOptionProps {
  title: string
  isActive: boolean
  onSelect: () => void
}

// One service in the list: a button that shows its picture; the chosen one is white.
// The h3 gives search engines a heading for each service inside the h2 section title
export const ServiceOption = ({ title, isActive, onSelect }: ServiceOptionProps) => (
  <li>
    <h3>
      <button
        type='button'
        aria-pressed={isActive}
        onClick={onSelect}
        className={clsx(
          'origin-left cursor-pointer text-left text-[1em] leading-[inherit] font-[inherit] tracking-[inherit] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background',
          // Pressing squeezes it quickly; letting go springs it back, like the tile buttons
          '[transition:color_0.6s_var(--ease-expo-out),scale_0.6s_var(--ease-spring)] active:scale-96 active:[transition:color_0.6s_var(--ease-expo-out),scale_0.1s_ease-out]',
          isActive ? 'text-background' : 'text-background/40 hover:text-background/70'
        )}
      >
        {title}
      </button>
    </h3>
  </li>
)
