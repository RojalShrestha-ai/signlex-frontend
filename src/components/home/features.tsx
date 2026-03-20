'use client'

import React from 'react'
import { Heading, BodyText } from '../common/typography'
import {
  ArtificialIntelligence02Icon,
  HandGripIcon,
  BookOpen01Icon,
  Award01Icon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useSound } from '@/lib/use-sound'

const features = [
  {
    icon: ArtificialIntelligence02Icon,
    title: 'AI-Powered Recognition',
    description: 'Advanced machine learning models analyze your hand gestures in real-time, providing instant feedback on accuracy and form.',
  },
  {
    icon: HandGripIcon,
    title: 'Interactive Lessons',
    description: 'Practice with our comprehensive library of ASL signs. Learn at your own pace with step-by-step video demonstrations.',
  },
  {
    icon: BookOpen01Icon,
    title: 'Structured Curriculum',
    description: 'Follow our expertly designed learning path from basics to advanced conversation. Track your progress every step of the way.',
  },
  {
    icon: Award01Icon,
    title: 'Gamified Learning',
    description: 'Earn badges, compete on leaderboards, and unlock new levels as you master ASL. Learning has never been this fun.',
  },
]

const Features = () => {
  const { play } = useSound()

  return (
    <section className="w-full">
      <div className="capsule py-20 md:py-32 border-l border-r border-slate-100">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Heading variant="h2" className="text-foreground mb-4">
            Everything You Need to Master ASL
          </Heading>
          <BodyText variant="medium" className="text-muted">
            Our platform combines cutting-edge AI technology with proven learning methods to help you become fluent in American Sign Language.
          </BodyText>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-8 bg-white rounded-lg border border-slate-100 hover:border-primary/20 cursor-pointer transition-all duration-300"
              onMouseEnter={() => play('pop', 0.15)}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <HugeiconsIcon icon={feature.icon} className="w-6 h-6 text-primary" />
                </div>
              </div>
              <Heading variant="h4" className="mb-3 text-foreground">
                {feature.title}
              </Heading>
              <BodyText variant="regular" className="text-muted">
                {feature.description}
              </BodyText>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { Features }
