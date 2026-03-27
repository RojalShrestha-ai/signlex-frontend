import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  GithubIcon, 
  TwitterIcon, 
  Linkedin01Icon,
  Mail01Icon 
} from '@hugeicons/core-free-icons'
import { BodyText } from './typography'
import { HugeiconsIcon } from '@hugeicons/react'

const Footer = () => {
  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Lessons', href: '/lessons' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
    company: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'ASL Dictionary', href: '/dictionary' },
      { label: 'Support', href: '/support' },
      { label: 'API', href: '/api' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  }

  const socialLinks = [
    { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin01Icon, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail01Icon, href: 'mailto:hello@signlex.com', label: 'Email' },
  ]

  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200">
      <div className="capsule py-12 md:py-16 border-l border-r border-slate-200">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.svg"
                alt="SignLex Logo"
                width={160}
                height={40}
                className="w-40"
              />
            </Link>
            <BodyText variant="small" className="text-muted mb-4 max-w-xs">
              Master American Sign Language through AI-powered interactive lessons and real-time feedback.
            </BodyText>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-all"
                  aria-label={social.label}
                >
                  <HugeiconsIcon icon={social.icon} className="w-4 h-4 text-muted"  />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm font-body">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href}>
                    <BodyText variant="small" className="text-muted hover:text-primary transition-colors">
                      {link.label}
                    </BodyText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm font-body">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href}>
                    <BodyText variant="small" className="text-muted hover:text-primary transition-colors">
                      {link.label}
                    </BodyText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm font-body">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href}>
                    <BodyText variant="small" className="text-muted hover:text-primary transition-colors">
                      {link.label}
                    </BodyText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm font-body">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href}>
                    <BodyText variant="small" className="text-muted hover:text-primary transition-colors">
                      {link.label}
                    </BodyText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
      </div>
        <div className=" border-t border-slate-200 flex items-center justify-center gap-4">
          <div className='flex border-slate-200 border-l border-r py-6 items-center h-full w-full mx-auto justify-between capsule'>
          <BodyText variant="small" className="text-muted">
            © {new Date().getFullYear()} SignLex. All rights reserved.
          </BodyText>
          <BodyText variant="small" className="text-muted">
            Built with ❤️ by the SignLex Team
          </BodyText>
          </div>
        </div>
    </footer>
  )
}

export { Footer }