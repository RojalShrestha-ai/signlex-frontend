import React from 'react'
import Link from 'next/link'
import { Heading, BodyText } from '../common/typography'
import { Button } from '../ui/Button'
import { ArrowRight01Icon, UserGroupIcon, BookOpen01Icon, Award01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const team = [
  {
    initials: 'RS',
    name: 'Rojal Shrestha',
    role: 'AI & ML Developer',
    bio: 'Senior at Mcneese State University focusing on Machine Learning and Artificial Intelligence.',
  },
  {
    initials: 'AM',
    name: 'Amin Memon',
    role: 'Backend Developer',
        bio: 'Senior at Mcneese State University focusing on Backend Systems.',
  },
  {
    initials: 'PR',
    name: 'Pawan Rijal',
    role: 'Frontend Developer',
        bio: 'Senior at Mcneese State University focusing on Frontend, User Interface & Experience.',
  },
]

const values = [
  {
    icon: UserGroupIcon,
    title: 'Accessibility First',
    description:
      'Every design decision starts by asking: does this work for the deaf and hard-of-hearing community?',
  },
  {
    icon: BookOpen01Icon,
    title: 'Research-Backed',
    description:
      'Our curriculum is grounded in peer-reviewed linguistics research and expert interpreter feedback.',
  },
  {
    icon: Award01Icon,
    title: 'Real-Time Feedback',
    description:
      'AI that gives you instant, honest correction — not encouragement theater.',
  },
  {
    icon: BookOpen01Icon,
    title: 'Open to All',
    description:
      'Core learning features are free forever. Inclusion shouldn\'t cost a premium.',
  },
]

const stats = [
  { value: '2021', label: 'Founded' },
  { value: '10,000+', label: 'Active Learners' },
  { value: '500+', label: 'ASL Signs' },
  { value: '98%', label: 'Accuracy Rate' },
]

const AboutPage = () => {
  return (
    <main className="w-full">

      {/* ── Hero ── */}
      <section className="w-full bg-primary overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10">
          <div className="capsule py-20 md:py-28 border-l border-r border-white/20 flex flex-col items-center text-center gap-6  mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
              <span className="text-sm font-semibold text-white font-body">Our Story</span>
            </div>
            <Heading variant="h1" className="text-white max-w-3xl">
              Building Bridges Through Sign Language
            </Heading>
            <BodyText variant="medium" className="text-white/75 max-w-xl">
              SignLex was born from a simple belief: that language barriers between hearing and deaf communities
              can be torn down with the right technology.
            </BodyText>
          </div>

          {/* Stats strip */}
          {/* <div className="capsule grid grid-cols-2 md:grid-cols-4 gap-6 py-12 border-l border-r border-t border-white/20">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-white font-display">{stat.value}</span>
                <span className="text-sm text-white/60 font-body">{stat.label}</span>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="w-full border-b border-slate-100">
        <div className="capsule py-20 md:py-28 border-l border-r border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-dashed border-secondary self-start">
                <span className="text-xs font-bold text-primary font-body uppercase tracking-wider">Mission</span>
              </div>
              <Heading variant="h2" className="text-foreground">
                Why We Built SignLex
              </Heading>
              <BodyText variant="regular" className="text-muted">
                In the US alone, over 11,000 schools lack access to qualified ASL interpreters. Deaf students,
                family members, and healthcare workers all need accessible, effective ASL training — and
                couldn't find it in one place.
              </BodyText>
              <BodyText variant="regular" className="text-muted">
                We combined AI-powered gesture recognition with a curriculum designed by certified interpreters
                to create the most effective ASL learning experience available online — for free.
              </BodyText>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { text: 'No certified interpreters in 11,000+ US schools', highlight: false },
                { text: '48M Americans experience some degree of hearing loss', highlight: false },
                { text: 'Average ASL class costs $800–$1,200 per semester', highlight: false },
                { text: 'SignLex: structured, AI-graded, free to start', highlight: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-sm border border-slate-100 bg-white">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      item.highlight ? 'bg-green-500' : 'bg-primary/40'
                    }`}
                  />
                  <BodyText
                    variant="regular"
                    className={item.highlight ? 'text-foreground font-semibold' : 'text-muted'}
                  >
                    {item.text}
                  </BodyText>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      {/* <section className="w-full bg-slate-50 border-b border-slate-100">
        <div className="capsule py-20 md:py-28 border-l border-r border-slate-100">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Heading variant="h2" className="text-foreground mb-4">
              What Guides Every Decision
            </Heading>
            <BodyText variant="medium" className="text-muted">
              Four principles that shape every feature we ship.
            </BodyText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="group p-8 bg-white rounded-lg border border-slate-100 hover:border-primary/20 cursor-pointer transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <HugeiconsIcon icon={v.icon} className="w-6 h-6 text-primary" />
                </div>
                <Heading variant="h4" className="mb-3 text-foreground">
                  {v.title}
                </Heading>
                <BodyText variant="regular" className="text-muted">
                  {v.description}
                </BodyText>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── Team ── */}
      <section className="w-full border-b border-slate-100">
        <div className="capsule py-20 md:py-28 border-l border-r border-slate-100">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <Heading variant="h2" className="text-foreground mb-4">
              The Minds Behind SignLex
            </Heading>
            <BodyText variant="medium" className="text-muted">
              A small team with a big mission.
            </BodyText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center gap-4 p-8 bg-white rounded-lg border border-slate-100 hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xl font-bold text-white font-display">{member.initials}</span>
                </div>
                <div>
                  <Heading variant="h4" className="text-foreground mb-1">
                    {member.name}
                  </Heading>
                  <BodyText variant="small" className="text-primary font-semibold uppercase tracking-wider mb-3">
                    {member.role}
                  </BodyText>
                  <BodyText variant="regular" className="text-muted">
                    {member.bio}
                  </BodyText>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {/* <section className="w-full bg-primary overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative z-10">
          <div className="capsule py-20 md:py-28 border-l border-r border-white/20 flex flex-col items-center text-center gap-6  mx-auto">
            <Heading variant="h2" className="text-white">
              Ready to Start Learning?
            </Heading>
            <BodyText variant="medium" className="text-white/75">
              Join 10,000+ learners building real ASL skills with AI-powered feedback.
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link href="/auth/signup">
                <Button label="Create Free Account" variant="outline" size="lg" rightIcon={ArrowRight01Icon} />
              </Link>
              <Link href="/lessons">
                <Button label="Explore Lessons" variant="outline" size="lg" leftIcon={BookOpen01Icon} />
              </Link>
            </div>
          </div>
        </div>
      </section> */}

    </main>
  )
}

export { AboutPage }