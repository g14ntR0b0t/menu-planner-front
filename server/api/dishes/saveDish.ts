import type { IncomingMessage } from 'http'
import { defineEventHandler } from 'h3'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const req = event.node.req as IncomingMessage
  const config = useRuntimeConfig()

  const formData = new FormData()

  formData.append('type', body.type)
  formData.append('name', body.name)
  formData.append('description', body.description)

  formData.append('details', JSON.stringify(body.details))

  if (body.image) {
    formData.append('image', body.image as any) // adjust if using File
  }

  // Forward request to Django backend
  const response = await $fetch(`${config.public.apiBase}/dish/create/`, {
    method: 'POST',
    body: formData,
  })

  return response
})