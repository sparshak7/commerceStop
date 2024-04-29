import { Loader2 } from "lucide-react"

const loading = () => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className="size-20 animate-spin text-accent"/>
    </div>
  )
}
export default loading