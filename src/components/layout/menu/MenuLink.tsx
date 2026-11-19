'use client'

import Link from 'next/link'

import { handleSectionLinkClick } from '@/lib/scrollToSection'

interface MenuLinkProps {
  href: string
  label: string
  onClick: () => void
}

export const MenuLink = ({ href, label, onClick }: MenuLinkProps) => (
  <Link
    href={href}
    onClick={event => {
      onClick()
      handleSectionLinkClick(event, href)
    }}
    className='block py-[calc(10*var(--text-unit))] text-[calc(44*var(--text-unit))] leading-none font-bold tracking-[-0.03em]'
  >
    {label}
  </Link>
)
