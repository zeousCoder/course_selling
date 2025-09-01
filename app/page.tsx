import Banner from '@/components/home/Banner'
import { BoxRevealDemo } from '@/components/home/BoxRevealDemo'
import InstructorSection from '@/components/home/InstructorSection'
import { MarqueeDemo } from '@/components/home/MarqueeDemo'
import ProjectsSection from '@/components/home/Meteors'
import Pricing from '@/components/home/PaymentCard'
import ProblemTransformation from '@/components/home/ProblemTransformation'
import ProgramDifference from '@/components/home/ProgramDifference'
import WhoIsThisFor from '@/components/home/WhoIsThisFor'
import React from 'react'

export default function Home() {
  return (
    <div className='flex flex-col gap-20 mx-auto justify-center items-center  pt-26 pb-10'>
      <Banner />
      <ProjectsSection />
      <WhoIsThisFor />
      <ProblemTransformation />
      <ProgramDifference />
      <MarqueeDemo />
      <Pricing />
      <BoxRevealDemo />
      <InstructorSection />
    </div>
  )
}
