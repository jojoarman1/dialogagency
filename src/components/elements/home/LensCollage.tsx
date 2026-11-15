'use client'

import clsx from 'clsx'
import Image from 'next/image'

import { LENS_IMAGE_SIZES, LENS_SPRITE_IMAGE_SIZES } from '@/config/lens'
import type { ServiceArt } from '@/config/services.types'
import { useLensCollage } from '@/hooks/useLensCollage'

import { LensControls } from './LensControls'
import { LENS_CANVAS_STYLE } from './lens.styles'

interface LensCollageProps {
  art: ServiceArt
  isActive: boolean
}

export const LensCollage = ({ art, isActive }: LensCollageProps) => {
  const lensCollage = useLensCollage({ art, isActive })

  if (!lensCollage.state.isSupported) {
    return (
      <div
        className={clsx(
          'transition-opacity duration-500',
          // The papers are 3:4, inset in the column like the WebGL layout; a sheet fills it
          art.isSheet
            ? 'absolute inset-0'
            : 'absolute top-1/2 left-1/2 aspect-3/4 w-[92%] -translate-1/2',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Image src={art.background} alt='' fill sizes={LENS_IMAGE_SIZES} className='object-cover' />
        {art.sprites?.map(sprite => (
          <Image
            key={`${sprite.src}:${sprite.x}:${sprite.y}`}
            src={sprite.src}
            alt=''
            width={0}
            height={0}
            sizes={LENS_SPRITE_IMAGE_SIZES}
            className='absolute h-auto max-w-none'
            style={{
              left: `${sprite.x * 100}%`,
              top: `${sprite.y * 100}%`,
              width: `${sprite.width * 100}%`
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <canvas ref={lensCollage.refs.canvasRef} className='absolute' style={LENS_CANVAS_STYLE} />
      {lensCollage.state.isInteractive && !!art.sprites && (
        <LensControls
          sprites={art.sprites}
          controlRefs={lensCollage.refs.controlRefs}
          getControlProps={lensCollage.functions.getControlProps}
        />
      )}
    </>
  )
}
