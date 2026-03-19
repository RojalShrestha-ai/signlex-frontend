'use client'

import React from 'react'
import { Heading, SubHeading } from '../common/typography'
import { Button } from '../ui/Button'
import { ArrowRight01Icon, VideoReplayIcon } from '@hugeicons/core-free-icons'
import Image from 'next/image'
import Link from 'next/link'
import { useSound } from '@/lib/use-sound'

const Herosection = () => {
  const { play } = useSound()

  return (
    <section className="w-full border-b border-slate-100 bg-slate-50 relative overflow-hidden">
      <div className="capsule border-l border-r py-20 md:py-28 border-slate-200">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Left: Text Content */}
          <div className="flex flex-col gap-6 flex-1 md:items-start md:text-left items-center text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-dashed border-secondary">
              <span className="text-sm font-bold text-primary font-body">
                AI-Powered ASL Learning
              </span>
            </div>

            {/* Headline */}
            <Heading variant="h1" className="text-foreground">
              Learn Sign Language With AI
            </Heading>

            {/* Subheadline */}
            <SubHeading className="text-muted max-w-lg">
              Master American Sign Language through interactive lessons, real-time gesture recognition, and personalized AI feedback. Start your journey today.
            </SubHeading>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/auth/signup">
                <Button
                  label="Start Learning Free"
                  variant="primary"
                  size="lg"
                  rightIcon={ArrowRight01Icon}
                  onClick={() => play('pop', 0.4)}
                />
              </Link>
              {/* <Button
                label="Watch Demo"
                variant="outline"
                size="lg"
                leftIcon={VideoReplayIcon}
                onClick={() => play('click', 0.3)}
              /> */}
            </div>
          </div>

          {/* Right: Dashboard preview */}
          <div className="relative flex-1 w-full">
            <div className="relative rounded-lg overflow-hidden ">
              <Image
                src="/mascot.svg"
                alt="SignLex Dashboard"
                width={700}
                height={700}
                className="w-80 h-80 object-contain mx-auto"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export { Herosection }
