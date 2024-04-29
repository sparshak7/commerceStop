'use client'

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const GoBack = () => {
  const router = useRouter()
  return (
    <ArrowLeft onClick={() => router.back()} className="size-8 cursor-pointer border border-accent"/>
  )
}
export default GoBack