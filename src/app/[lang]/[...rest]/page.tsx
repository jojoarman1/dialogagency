import { notFound } from 'next/navigation'

// Any unknown path under a language shows that language's 404 (not-found.tsx): the root layout
// lives in [lang], so there is no app-wide one
export default function UnknownPage() {
  notFound()
}
