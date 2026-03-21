import { ASLQuizSection } from '@/components/home/aslquizsection'
import { CTASection } from '@/components/home/ctasection'
import { Features } from '@/components/home/features'
import { Herosection } from '@/components/home/herosection'
import React from 'react'

const page = () => {
  return (
    <div>
      <Herosection />
      <CTASection />
      <ASLQuizSection />
      <Features />
    </div>
  )
}

export default page
