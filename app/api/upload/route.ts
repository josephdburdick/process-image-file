import { NextResponse, NextRequest } from "next/server"

const imageFileRegex = /^image\/(jpeg|png|gif|bmp|webp)$/i

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const entries = Object.fromEntries(formData.entries())
  const values = Array.from(formData.values())
  const images = values.filter(
    (value) => value?.type && value?.type?.match(imageFileRegex)
  )
  console.log({ images })

  return new NextResponse(formData)
}
