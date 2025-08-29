"use client"

import DashboardLayout from "@/lib/layouts/DashboardLayout"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/signin')
  }, [])
  return (
    <DashboardLayout>
      .
    </DashboardLayout>
  )
}