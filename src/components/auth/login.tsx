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

export function LoginPage() {
  const router = useRouter()
  const { loginMutation } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !password) return
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          router.push('/dashboard')
        },
      },
    )
  }

  const { isPending, isError, error } = loginMutation

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-md -mt-20 ">

          {/* Header */}
          <div className="mb-8">
            <Heading variant="h2" className="mb-2">
              Welcome back
            </Heading>
            <BodyText variant="regular" className="text-muted">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </BodyText>
          </div>

          {/* Social Login */}
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
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2 font-body">
                Email or username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground font-body">
                  Password
                </label>
                {/* <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline font-body">
                  Forgot password?
                </Link> */}
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted font-body">
                Remember me for 30 days
              </label>
            </div>

            {isError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <BodyText variant="small" className="text-red-600">
                  {getErrorMessage(error)}
                </BodyText>
              </div>
            )}

            <Button
              label={isPending ? 'Signing in...' : 'Sign in'}
              variant="primary"
              size="md"
              rightIcon={ArrowRight01Icon}
              className="w-full"
              type="submit"
              disabled={isPending}
            />
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <BodyText variant="small" className="text-muted">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </BodyText>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-accent items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <Heading variant="h2" className="text-white mb-4">
            Learn ASL at your own pace
          </Heading>
          <BodyText variant="medium" className="text-white/90 mb-8">
            Join thousands of students mastering American Sign Language through our AI-powered platform.
          </BodyText>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-sm text-white/80">Active Learners</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm text-white/80">ASL Signs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
