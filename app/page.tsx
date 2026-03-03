'use client'

import Navigation from "@/components/Navigation"
import HomePage from "@/components/HomePage"

export default function Home() {
  return (
    <>
      <Navigation />
      <main
        className="min-h-screen w-full"
        style={{
          background: 'linear-gradient(180deg, #050816 0%, #0a0f2c 30%, #050816 100%)',
        }}
      >
        <HomePage />
      </main>
    </>
  )
}
