"use client"
import { useParams } from 'next/navigation'
import React from 'react'

export default function page() {
    const name = useParams()
    return (
        <div>{name.name}</div>
    )
}
