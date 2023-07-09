import Image from "next/image"
import ImageProcessForm from "./ImageProcessForm"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ImageProcessForm />
    </main>
  )
}
