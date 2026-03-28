'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'
import { BodyText, Heading } from '../common/typography'

interface ButtonProps {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: IconSvgElement | ReactNode
  rightIcon?: IconSvgElement | ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const variants = {
  primary: cn(
    'bg-primary text-white',
    // 'shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,100,178,0.3)]',
    'hover:bg-[#0056a0]',
    // 'hover:shadow-[0_4px_20px_rgba(0,100,178,0.4)]',
    'active:scale-[0.98]',
  ),
  outline: cn(
    'bg-background text-foreground',
    'border border-muted/30',
    // 'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
    'hover:bg-muted/10',
    'hover:border-muted/50',
    // 'hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]',
    'active:scale-[0.98]',
  ),
  ghost: cn(
    'bg-transparent text-muted',
    'hover:bg-muted/10',
    'hover:text-foreground',
    'active:scale-[0.98]',
  ),
}

const sizes = {
  sm: 'h-8 px-3.5 text-[13px] gap-1.5 rounded-sm',
  md: 'h-10 px-5 text-[1rem] gap-2 rounded-sm',
  lg: 'h-12 px-6 text-[1.25rem] gap-2.5 rounded-sm',
}

const iconSizes = { sm: 14, md: 15, lg: 16 }

function isIconSvgElement(icon: IconSvgElement | ReactNode): icon is IconSvgElement {
  return Array.isArray(icon)
}

function RenderIcon({
  icon,
  size,
}: {
  icon: IconSvgElement | ReactNode
  size: number
}) {
  if (isIconSvgElement(icon)) {
    return (
      <HugeiconsIcon
        icon={icon}
        size={size}
        strokeWidth={2}
        color="currentColor"
      />
    )
  }
  return <>{icon}</>
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  disabled,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium',
        'font-[family-name:var(--font-display)]',
        'whitespace-nowrap select-none',
        'transition-all duration-150 ease-out',
        'cursor-pointer outline-none',
        'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {leftIcon && <RenderIcon icon={leftIcon} size={iconSizes[size]} />}
      <BodyText variant='medium' className='font-normal'>{label}</BodyText>
      {rightIcon && <RenderIcon icon={rightIcon} size={iconSizes[size]} />}
    </button>
  )
}