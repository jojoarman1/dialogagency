import type { RefObject } from 'react'

import type { LensSprite } from '@/config/lens.types'
import type { useLensInteraction } from '@/hooks/useLensInteraction'

import { LensSelectionFrame } from './LensSelectionFrame'
import { LENS_CANVAS_STYLE } from './lens.styles'

interface LensControlsProps {
  sprites: readonly LensSprite[]
  controlRefs: RefObject<(HTMLDivElement | null)[]>
  getControlProps: ReturnType<typeof useLensInteraction>['functions']['getControlProps']
}

// An invisible box over each labelled cut-out, kept on it every frame by the collage's redraw: it
// catches the pointer and shows the selection frame. Later cut-outs lie on top, like in the view
export const LensControls = ({ sprites, controlRefs, getControlProps }: LensControlsProps) => (
  <div className='absolute' style={LENS_CANVAS_STYLE}>
    {sprites.map((sprite, index) =>
      sprite.label ? (
        <div
          key={`${sprite.src}:${sprite.x}:${sprite.y}`}
          ref={element => {
            controlRefs.current[index] = element
          }}
          className='group/frame pointer-events-auto absolute top-0 left-0 cursor-grab touch-none select-none active:cursor-grabbing'
          {...getControlProps(index)}
        >
          <LensSelectionFrame label={sprite.label} />
        </div>
      ) : null
    )}
  </div>
)
