'use client'

import React from 'react'
import Link from 'next/link'
import { Heading, BodyText } from '../common/typography'
import { Button } from '../ui/Button'
import { ArrowRight01Icon, BookOpen01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useSound } from '@/lib/use-sound'

const stats = [
  { value: '100%', label: 'Interactive' },
  { value: '30+', label: 'ASL Signs' },
  { value: '85%', label: 'Accuracy Rate' },
  { value: 'Free', label: 'To Get Started' },
]

const CTASection = () => {
  const { play } = useSound()

  return (
    <section className="w-full bg-primary overflow-hidden relative">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                            radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className=" relative z-10">
      <div className='capsule py-20 md:py-28 border-l border-r border-white/20 '>
        <div className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <HugeiconsIcon icon={BookOpen01Icon} className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white font-body">
              Start Learning Today — It&apos;s Free
            </span>
          </div>

          {/* Heading */}
          <Heading variant="h2" className="text-white">
            Join Learning ASL With AI
          </Heading>

          <BodyText variant="medium" className="text-white/75 max-w-xl">
            Whether you&apos;re a beginner or looking to sharpen your skills, SignLex meets you where you are.
            Real-time feedback. Interactive quizzes. Zero cost to start.
          </BodyText>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/auth/signup">
              <Button
                label="Create Free Account"
                variant="outline"
                size="lg"
                rightIcon={ArrowRight01Icon}
                onClick={() => play('whoosh', 0.3)}
              />
            </Link>
            {/* <Link href="/lessons">
              <Button
                label="Explore Lessons"
                variant="outline"
                size="lg"
                leftIcon={BookOpen01Icon}
                onClick={() => play('click', 0.3)}
              />
            </Link> */}
          </div>
        </div>
        </div>
        {/* Stats row */}
        <div className="capsule grid grid-cols-2 md:grid-cols-4 gap-6  py-16 border-r border-l border-t border-white/20">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-3xl font-bold text-white font-display">{stat.value}</span>
              <span className="text-sm text-white/60 font-body">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { CTASection }
