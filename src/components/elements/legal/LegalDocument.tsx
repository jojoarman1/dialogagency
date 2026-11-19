import type { LegalDictionary, LegalDocumentText } from '@/config/dictionaries/dictionary.types'
import { LEGAL_UPDATED_AT } from '@/config/legal'
import { SITE_CONFIG } from '@/config/site'

interface LegalDocumentProps {
  legal: LegalDictionary
  document: LegalDocumentText
}

// An A4 sheet (794×1123 at 96 dpi, ~20 mm margins), centred like a printed document
export const LegalDocument = ({ legal, document }: LegalDocumentProps) => (
  <main className='flex justify-center px-7 pt-40 pb-30 max-lg:px-4 max-lg:pt-20 max-lg:pb-20'>
    <article className='flex min-h-[calc(1123*var(--text-unit))] w-[calc(794*var(--text-unit))] flex-col bg-white px-[calc(76*var(--text-unit))] py-[calc(76*var(--text-unit))] text-[calc(15*var(--text-unit))] leading-[1.5] text-foreground shadow-[0_0_calc(40*var(--text-unit))_rgb(0_0_0/0.08)] max-lg:min-h-0 max-lg:w-full max-lg:p-[calc(24*var(--text-unit))] max-lg:text-sm'>
      <h1 className='text-center text-[calc(20*var(--text-unit))] leading-tight font-bold uppercase max-lg:text-base'>
        {document.title}
      </h1>
      <p className='mt-[calc(16*var(--text-unit))] text-right text-muted'>
        {legal.updatedLabel} {LEGAL_UPDATED_AT}
      </p>
      {!!legal.translationNote && (
        <p className='mt-[calc(16*var(--text-unit))] italic text-muted'>{legal.translationNote}</p>
      )}

      {document.sections.map(section => (
        <section key={section.id} className='mt-[calc(24*var(--text-unit))]'>
          {!!section.title && (
            <h2 className='mb-[calc(8*var(--text-unit))] font-bold'>{section.title}</h2>
          )}
          {section.paragraphs.map(paragraph => (
            // Justified only where the line is wide enough: browsers don't hyphenate Russian,
            // so narrow justified lines open wide gaps
            <p
              key={paragraph}
              className='mt-[calc(8*var(--text-unit))] indent-[calc(32*var(--text-unit))] text-justify hyphens-auto first:mt-0 max-lg:text-left'
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <footer className='mt-auto flex items-end justify-between gap-[calc(24*var(--text-unit))] pt-[calc(56*var(--text-unit))]'>
        <p className='text-muted'>
          {legal.operatorLabel}
          <br />
          {legal.operatorName}
        </p>
        <span className='text-[calc(26*var(--text-unit))] leading-none font-bold tracking-tighter'>
          {SITE_CONFIG.name}
        </span>
      </footer>
    </article>
  </main>
)
