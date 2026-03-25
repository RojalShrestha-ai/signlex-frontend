'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heading, BodyText } from '../common/typography'
import { Button } from '../ui/Button'
import { ArrowRight01Icon, CheckmarkCircle01Icon, Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    tagline: 'Start your ASL journey — no credit card needed.',
    featured: false,
    features: [
      { included: true,  text: '50 ASL signs' },
      { included: true,  text: 'Interactive fingerspelling quiz' },
      { included: true,  text: 'Basic progress tracking' },
      { included: true,  text: 'Community forums' },
      { included: false, text: 'AI gesture recognition' },
      { included: false, text: 'Unlimited lessons' },
      { included: false, text: 'Downloadable certificates' },
      { included: false, text: 'Priority support' },
    ],
    cta: 'Get Started Free',
    ctaHref: '/auth/signup',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    monthlyPrice: 14,
    annualPrice: 9,
    tagline: 'For serious learners who want the full AI experience.',
    featured: true,
    badge: 'Most Popular',
    features: [
      { included: true,  text: '500+ ASL signs' },
      { included: true,  text: 'Interactive fingerspelling quiz' },
      { included: true,  text: 'Full progress tracking' },
      { included: true,  text: 'Community forums' },
      { included: true,  text: 'AI gesture recognition' },
      { included: true,  text: 'Unlimited lessons' },
      { included: true,  text: 'Downloadable certificates' },
      { included: false, text: 'Priority support' },
    ],
    cta: 'Start 14-Day Free Trial',
    ctaHref: '/auth/signup?plan=pro',
    ctaVariant: 'primary' as const,
  },
  {
    name: 'Teams',
    monthlyPrice: 39,
    annualPrice: 29,
    tagline: 'For organizations, schools, and healthcare teams.',
    featured: false,
    features: [
      { included: true, text: '500+ ASL signs' },
      { included: true, text: 'Interactive fingerspelling quiz' },
      { included: true, text: 'Full progress tracking' },
      { included: true, text: 'Community forums' },
      { included: true, text: 'AI gesture recognition' },
      { included: true, text: 'Unlimited lessons' },
      { included: true, text: 'Downloadable certificates' },
      { included: true, text: 'Priority support + admin dashboard' },
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact',
    ctaVariant: 'outline' as const,
  },
]

const faqs = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes — upgrades take effect immediately. Downgrades apply at the end of your current billing period.',
  },
  {
    q: 'Is the 14-day trial actually free?',
    a: 'Completely free. No credit card required. You get full Pro access and are only asked to pay at the end of the trial.',
  },
  {
    q: 'Do you offer discounts for students?',
    a: 'Yes — students with a valid .edu email receive 50% off Pro, indefinitely. Reach out via the Contact page.',
  },
  {
    q: 'What happens to my data if I cancel?',
    a: 'Your progress and certificates are preserved for 12 months after cancellation, then permanently deleted on request.',
  },
]

const PricingPage = () => {
  const [annual, setAnnual] = useState(true)

  return (
    <main className="w-full">

      {/* ── Header ── */}
      <section className="w-full bg-slate-50 border-b border-slate-100">
        <div className="capsule py-20 md:py-24 border-l border-r border-slate-100 flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-dashed border-secondary">
            <span className="text-xs font-bold text-primary font-body uppercase tracking-wider">Pricing</span>
          </div>
          <Heading variant="h1" className="text-foreground">
            Simple, Honest Pricing
          </Heading>
          <BodyText variant="medium" className="text-muted max-w-md">
            Start free. Upgrade when you're ready. No dark patterns, no hidden fees.
          </BodyText>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white border border-slate-200 mt-2">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold font-body transition-all duration-200 ${
                !annual ? 'bg-primary text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold font-body transition-all duration-200 flex items-center gap-2 ${
                annual ? 'bg-primary text-white' : 'text-muted hover:text-foreground'
              }`}
            >
              Annual
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${annual ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                Save 35%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Plans ── */}
      <section className="w-full border-b border-slate-100">
        <div className="capsule py-16 md:py-20 border-l border-r border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col gap-6 p-8 rounded-sm border transition-all duration-300 ${
                  plan.featured
                    ? 'border-primary bg-white shadow-lg shadow-primary/10'
                    : 'border-slate-200 bg-white hover:border-primary/30'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary">
                      <span className="text-xs font-bold text-white font-body uppercase tracking-wider">
                        {plan.badge}
                      </span>
                    </div>
                  </div>
                )}

                {/* Plan name + price */}
                <div>
                  <BodyText variant="small" className="text-primary font-bold uppercase tracking-widest mb-3">
                    {plan.name}
                  </BodyText>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-foreground font-display">
                      {plan.annualPrice === 0 ? 'Free' : `$${annual ? plan.annualPrice : plan.monthlyPrice}`}
                    </span>
                    {plan.annualPrice > 0 && (
                      <span className="text-sm text-muted font-body">
                        / mo{annual ? ', billed annually' : ''}
                      </span>
                    )}
                  </div>
                  <BodyText variant="small" className="text-muted">{plan.tagline}</BodyText>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Features */}
                <ul className="flex flex-col gap-3">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-3">
                      <HugeiconsIcon
                        icon={f.included ? CheckmarkCircle01Icon : Cancel01Icon}
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${f.included ? 'text-green-500' : 'text-slate-300'}`}
                      />
                      <BodyText variant="small" className={f.included ? 'text-foreground' : 'text-muted/50'}>
                        {f.text}
                      </BodyText>
                    </li>
                  ))}
                </ul>

                <Link href={plan.ctaHref} className="mt-auto">
                  <Button label={plan.cta} variant={plan.ctaVariant} size="lg" rightIcon={ArrowRight01Icon} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full bg-slate-50 border-b border-slate-100">
        <div className="capsule py-20 border-l border-r border-slate-100">
          <div className="text-center mb-12">
            <Heading variant="h2" className="text-foreground mb-4">
              Frequently Asked Questions
            </Heading>
            <BodyText variant="medium" className="text-muted max-w-md mx-auto">
              Still unsure? Here are answers to the most common questions.
            </BodyText>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-sm border border-slate-100 hover:border-primary/20 transition-all duration-300"
              >
                <Heading variant="h4" className="text-foreground mb-3">{faq.q}</Heading>
                <BodyText variant="regular" className="text-muted">{faq.a}</BodyText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
          <div className="capsule py-20 border-l border-r border-white/20 flex flex-col items-center text-center gap-6 mx-auto">
            <Heading variant="h2" className="text-white">Not Sure Where to Start?</Heading>
            <BodyText variant="medium" className="text-white/75">
              The Free plan has no time limit. Start there, upgrade whenever it makes sense.
            </BodyText>
            <Link href="/auth/signup">
              <Button label="Start for Free" variant="outline" size="lg" rightIcon={ArrowRight01Icon} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

export { PricingPage }