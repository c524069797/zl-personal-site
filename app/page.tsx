'use client'

import Navigation from "@/components/Navigation"
import HomePage from "@/components/HomePage"

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen w-full">
        <HomePage />
      </main>
    </>
  )
}
