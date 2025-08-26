"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/signin')
  }, [])
  return (
    <div>
      <h1 className="text-center mt-20">LKD Dashboard</h1>
    </div>
  )
}