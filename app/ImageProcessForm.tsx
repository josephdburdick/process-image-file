"use client"

import { FormEvent } from "react"
import Exifr from "exifr"
import { extractColors } from "extract-colors"

const getColors = async (file: File) => {
  if (!file) return
  const img = new Image()
  const url = window.URL.createObjectURL(file)
  img.src = url
  const colors = await extractColors(img)
  img.remove()
  return colors
}

const getExif = async (file: File) => {
  if (!file) return
  return await Exifr.parse(file)
}

const getBlob = async (file: File) => {
  if (!file) return
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const { result: base64 } = fileReader
      if (!base64) reject()
      resolve(base64)
    }
    fileReader.readAsDataURL(file)
  })
}

const processImage = async (file: File) => {
  if (!file) return
  const [colors, exif, blob] = await Promise.all([
    getColors(file),
    getExif(file),
    getBlob(file),
  ])
  return { colors, exif, blob }
}

const processFormData = (form: HTMLFormElement) => {
  const formData = new FormData(form)
  const values = Array.from(formData.values())
  const files = values.filter((value) => value instanceof File)
  const hasFiles = files.length > 0

  // Append individual files to the formData
  if (hasFiles) {
    files.forEach(async (file, index) => {
      const processedImage = await processImage(file)
      formData.append(`file-${index}`, file)
      console.log({ processedImage })
    })
    formData.append("hasFiles", "true")
  }

  return formData
}

export const ImageProcessForm = () => {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = processFormData(event.currentTarget)
    fetch(event.currentTarget.action, {
      method: "POST",
      body: formData,
    })
  }
  return (
    <form action="/api/upload" method="post" onSubmit={onSubmit}>
      <input type="file" name="upload" id="upload" multiple accept="image/*" />
      <button type="submit">Submit</button>
    </form>
  )
}

export default ImageProcessForm
