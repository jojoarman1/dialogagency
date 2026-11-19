import { Cta } from '@/components/elements/home/Cta'
import { Faq } from '@/components/elements/home/Faq'
import { Hero } from '@/components/elements/home/Hero'
import { Projects } from '@/components/elements/home/Projects'
import { Services } from '@/components/elements/home/Services'
import { Testimonial } from '@/components/elements/home/Testimonial'
import { getDictionary, getRequestLocale } from '@/lib/dictionary.service'
import { getHomeJsonLd } from '@/lib/structuredData'

export default async function Home() {
  const locale = await getRequestLocale()
  const jsonLd = getHomeJsonLd(locale, getDictionary(locale))

  return (
    <main>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, `<` is escaped
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Hero />
      <Projects />
      <Testimonial />
      <Services />
      <Faq />
      <Cta />
    </main>
  )
}
