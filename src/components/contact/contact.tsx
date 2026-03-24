'use client'

import React, { useState } from 'react'
import { Heading, BodyText } from '../common/typography'
import { Button } from '../ui/Button'
import { ArrowRight01Icon, Mail01Icon, MessageMultiple01Icon, Location01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

const contactMethods = [
  {
    icon: Mail01Icon,
    label: 'Email',
    value: 'hello@signlex.com',
    sub: 'We reply within 24 hours',
  },
  {
    icon: MessageMultiple01Icon,
    label: 'Live Chat',
    value: 'Available in-app',
    sub: 'Mon–Fri, 9am–6pm CST',
  },
  {
    icon: Location01Icon,
    label: 'Based in',
    value: 'New Orleans, LA',
    sub: 'United States',
  },
]

const subjects = [
  'General Inquiry',
  'Technical Support',
  'Partnerships',
  'Student Discount',
  'Feedback',
  'Other',
]

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

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
          <div className="capsule py-20 md:py-24 border-l border-r border-white/20 flex flex-col items-center text-center gap-5  mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
              <span className="text-sm font-semibold text-white font-body">Get in Touch</span>
            </div>
            <Heading variant="h1" className="text-white max-w-2xl text-balance">
              We'd Love to Hear From You
            </Heading>
            <BodyText variant="medium" className="text-white/75 max-w-md text-balance">
              Questions, feedback, or partnership ideas — we read every message and respond fast.
            </BodyText>
          </div>

          {/* Contact method strip */}
          <div className="capsule border-l border-r border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15">
              {contactMethods.map((method, idx) => (
                <div key={idx} className="flex items-center gap-4 px-8 py-6">
                  <div className="w-10 h-10 rounded-sm bg-white/10 flex items-center justify-center flex-shrink-0">
                    <HugeiconsIcon icon={method.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <BodyText variant="small" className="text-white/50 font-bold uppercase tracking-widest text-xs">
                      {method.label}
                    </BodyText>
                    <div className="text-white font-semibold text-sm font-body mt-0.5">{method.value}</div>
                    <BodyText variant="small" className="text-white/60 text-xs">{method.sub}</BodyText>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Form + Sidebar ── */}
      <section className="w-full border-b border-slate-100">
        <div className="capsule py-20 md:py-24 border-l border-r border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">

            {/* Form — 3 cols */}
            <div className="md:col-span-3">
              <Heading variant="h2" className="text-foreground mb-8">Send Us a Message</Heading>

              {sent ? (
                <div className="flex flex-col items-center text-center gap-5 py-16 border border-slate-100 rounded-sm bg-slate-50">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <Heading variant="h3" className="text-foreground mb-2">Message Sent!</Heading>
                    <BodyText variant="medium" className="text-muted">
                      We'll get back to you within 24 hours at <span className="text-foreground font-semibold">{form.email}</span>.
                    </BodyText>
                  </div>
                  <Button label="Send Another" variant="outline" size="lg" onClick={() => setSent(false)} />
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider font-body">Name</label>
                      <input
                        className="px-4 py-3 border border-slate-200 rounded-sm text-sm font-body text-foreground bg-white focus:outline-none focus:border-primary transition-colors placeholder:text-muted"
                        placeholder="Your name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider font-body">Email</label>
                      <input
                        type="email"
                        className="px-4 py-3 border border-slate-200 rounded-sm text-sm font-body text-foreground bg-white focus:outline-none focus:border-primary transition-colors placeholder:text-muted"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider font-body">Subject</label>
                    <select
                      className="px-4 py-3 border border-slate-200 rounded-sm text-sm font-body text-foreground bg-white focus:outline-none focus:border-primary transition-colors"
                      value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                    >
                      {subjects.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider font-body">Message</label>
                    <textarea
                      rows={6}
                      className="px-4 py-3 border border-slate-200 rounded-sm text-sm font-body text-foreground bg-white focus:outline-none focus:border-primary transition-colors placeholder:text-muted resize-none"
                      placeholder="Tell us what's on your mind…"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    label="Send Message"
                    variant="primary"
                    size="lg"
                    rightIcon={ArrowRight01Icon}
                    type="submit"
                  />
                </form>
              )}
            </div>

            {/* Sidebar — 2 cols */}
            <div className="md:col-span-2 flex flex-col gap-6">

              {/* Schools card */}
              <div className="p-6 bg-primary rounded-sm flex flex-col gap-3 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10 pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }}
                />
                <div className="relative z-10 flex flex-col gap-3">
                  <Heading variant="h4" className="text-white">For Schools & Healthcare</Heading>
                  <BodyText variant="small" className="text-white/75">
                    We offer custom institutional licensing, bulk student accounts, and dedicated onboarding support.
                    Get in touch and we'll have a proposal ready within 48 hours.
                  </BodyText>
                  <Button label="Request a Proposal" variant="outline" size="lg" rightIcon={ArrowRight01Icon} />
                </div>
              </div>

              {/* Common questions */}
              <div className="border border-slate-100 rounded-sm bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <Heading variant="h4" className="text-foreground">Common Questions</Heading>
                </div>
                {[
                  { q: 'How do I cancel?', a: 'Settings → Subscription → Cancel.' },
                  { q: 'Where are my certificates?', a: 'Profile → Achievements → Download.' },
                  { q: 'Found a bug?', a: 'Use subject "Technical Support" and include your device and browser.' },
                ].map((item, idx, arr) => (
                  <div
                    key={idx}
                    className={`px-6 py-4 ${idx < arr.length - 1 ? 'border-b border-slate-100' : ''}`}
                  >
                    <div className="text-sm font-semibold text-foreground font-body mb-1">{item.q}</div>
                    <BodyText variant="small" className="text-muted">{item.a}</BodyText>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

export { ContactPage }