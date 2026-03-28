import React from 'react'
import { Plus_Jakarta_Sans, DM_Sans, JetBrains_Mono } from 'next/font/google'

export const displayFont = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display'
})

export const bodyFont = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body'
})

export const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono'
})

type HeadingProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  children: React.ReactNode
  className?: string
}

type SubHeadingProps = {
  variant?: 'sh1'
  children: React.ReactNode
  className?: string
}

type BodyProps = {
  variant: 'big' | 'medium' | 'mediumbold' | 'regular' | 'small' | 'small-medium' | 'trimmed' | 'small-trimmed'
  children: React.ReactNode
  className?: string
}

export function Heading({
  variant = 'h1',
  children,
  className = '',
}: HeadingProps) {
  const baseClasses: Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', string> = {
    h1: 'text-[2.25rem] leading-[2.5rem] md:text-[3.5rem] md:leading-[3.75rem]  font-bold tracking-[-0.02em] font-display',
    h2: 'text-[1.5rem] leading-[1.8rem] md:text-[2.5rem] md:leading-[2.75rem]  font-bold tracking-[-0.02em] font-display',
    h3: 'text-[1.25rem] leading-[1.5rem] md:text-[1.5rem] md:leading-[1.8rem]  font-bold tracking-[-0.01em] font-display',
    h4: 'text-[1rem] leading-[1.25rem] md:text-[1.125rem] md:leading-[1.35rem]  font-semibold tracking-[-0.01em] font-display',
    h5: 'text-[0.875rem] leading-[1.3125rem] md:text-[1.125rem] md:leading-[1.5rem]  font-semibold font-body',
    h6: 'text-[0.875rem] leading-[1.3125rem] md:text-[1rem] md:leading-[1.125rem]  font-semibold font-body',
  }

  const Component = variant as keyof React.JSX.IntrinsicElements

  return (
    <Component className={`${baseClasses[variant]} ${className}`}>
      {children}
    </Component>
  )
}

export function SubHeading({
  variant = 'sh1',
  children,
  className = '',
}: SubHeadingProps) {
  const baseClasses: Record<'sh1', string> = {
    sh1: 'text-[0.875rem] leading-[1.3125rem] md:text-[1.125rem] md:leading-[1.75rem] font-[family-name:var(--font-dm-sans)] font-normal',
  }

  return (
    <div className={`${baseClasses[variant]} ${className} font-body`}>
      {children}
    </div>
  )
}

export function BodyText({
  variant,
  children,
  className = '',
}: BodyProps) {
  const baseClasses: Record<BodyProps['variant'], string> = {
    big: 'text-[1rem] md:text-[2.25rem] leading-[1.5rem] md:leading-[3rem] tracking-normal font-[family-name:var(--font-dm-sans)] font-medium',
    medium: 'text-[0.875rem] leading-[1.3125rem] md:text-[1rem] md:leading-[1.6rem] tracking-normal font-[family-name:var(--font-dm-sans)]',
    mediumbold: 'text-[0.875rem] leading-[1.3125rem] md:text-[1rem] md:leading-[1.125rem] tracking-normal font-[family-name:var(--font-dm-sans)] font-bold',
    regular: 'text-[0.875rem] leading-[1.3125rem] md:text-[1rem] md:leading-[1.75rem] tracking-normal font-[family-name:var(--font-dm-sans)]',
    small: 'text-[0.75rem] leading-[1.125rem] md:text-[0.875rem] md:leading-[1.3125rem] font-[family-name:var(--font-dm-sans)]',
    'small-medium': 'text-[0.75rem] leading-[1.125rem] md:text-[0.875rem] md:leading-[1.3125rem] font-[family-name:var(--font-dm-sans)] font-medium',
    trimmed: 'text-[0.75rem] leading-[1.3125rem] md:text-[1rem] md:leading-[1.5rem] font-[family-name:var(--font-dm-sans)]',
    'small-trimmed': 'text-[0.75rem] leading-[1.125rem] md:text-[0.875rem] md:leading-[1.3125rem] font-[family-name:var(--font-dm-sans)]',
  }

  return (
    <div className={`${baseClasses[variant]} ${className} font-body`}>
      {children}
    </div>
  )
}

