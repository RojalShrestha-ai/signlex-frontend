'use client'

import React, { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heading, BodyText } from '@/components/common/typography'
import { Button } from '@/components/ui/Button'
import { ArrowRight01Icon, GoogleIcon, GithubIcon } from '@hugeicons/core-free-icons'
import { useAuth } from '@/lib/providers'

function getErrorMessage(error: unknown): string {
  if (!error) return ''
  const anyErr = error as any
  return (
    anyErr?.response?.data?.message ??
    anyErr?.response?.data?.error ??
    anyErr?.message ??
    'Something went wrong. Please try again.'
  )
}

export default function SignupPage() {
  const router = useRouter()
  const { signupMutation } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)

    if (!firstName || !lastName || !email || !password) {
      setFormError('Please fill in all fields.')
      return
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }
    if (!agreed) {
      setFormError('You must accept the Terms of Service and Privacy Policy.')
      return
    }

    signupMutation.mutate(
      { firstName, lastName, email, password },
      {
        onSuccess: () => {
          router.push('/auth/login')
        },
      },
    )
  }

  const { isPending, isError, error } = signupMutation
  const displayError = formError ?? (isError ? getErrorMessage(error) : null)

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md -mt-20">

          {/* Header */}
          <div className="mb-8">
            <Heading variant="h2" className="mb-2">
              Create your account
            </Heading>
            <BodyText variant="regular" className="text-muted">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </BodyText>
          </div>

          {/* Social Signup */}
          {/* <div className="space-y-3 mb-6">
            <Button
              label="Continue with Google"
              variant="outline"
              size="md"
              leftIcon={GoogleIcon}
              className="w-full"
            />
            <Button
              label="Continue with GitHub"
              variant="outline"
              size="md"
              leftIcon={GithubIcon}
              className="w-full"
            />
          </div> */}

          {/* Divider */}
          {/* <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm text-muted font-body">
                Or continue with email
              </span>
            </div>
          </div> */}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2 font-body">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2 font-body">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 font-body">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2 font-body">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body"
              />
              <BodyText variant="small" className="text-muted mt-1">
                Must be at least 8 characters
              </BodyText>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary mt-1"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-muted font-body">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {displayError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <BodyText variant="small" className="text-red-600">
                  {displayError}
                </BodyText>
              </div>
            )}

            <Button
              label={isPending ? 'Creating account...' : 'Create account'}
              variant="primary"
              size="md"
              rightIcon={ArrowRight01Icon}
              className="w-full"
              type="submit"
              disabled={isPending}
            />
          </form>

          {/* Footer Note */}
          <div className="mt-6">
            <BodyText variant="small" className="text-muted text-center">
               Get started with a 14-day free trial. No credit card required.
            </BodyText>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-accent items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <Heading variant="h2" className="text-white mb-4">
            Start your ASL journey today
          </Heading>
          <BodyText variant="medium" className="text-white/90 mb-8">
            Master American Sign Language with personalized AI feedback and interactive lessons designed for all skill levels.
          </BodyText>

          {/* Features List */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold mb-1">AI-Powered Recognition</div>
                <div className="text-sm text-white/80">Real-time gesture analysis and feedback</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold mb-1">500+ ASL Signs</div>
                <div className="text-sm text-white/80">Comprehensive video library</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="font-semibold mb-1">Track Your Progress</div>
                <div className="text-sm text-white/80">Detailed analytics and milestones</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
