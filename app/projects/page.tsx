import React from 'react'
import { Metadata } from 'next'
import ProjectsCard from '@/components/projects/ProjectsCard'

export default function ProjectsPage() {
    return (
        <div className='flex flex-col gap-20 mx-auto justify-center items-center px-4   pt-26 pb-10'>

            <ProjectsCard />
        </div>
    )
}

export const metadata: Metadata = {
    title: "Projects",
    description: "Projects page",
}