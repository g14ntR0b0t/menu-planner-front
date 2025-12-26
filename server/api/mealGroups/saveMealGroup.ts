import { defineEventHandler } from 'h3'
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // Convert to form-encoded string (like HTML forms do)
  const formData = new URLSearchParams(body as Record<string, string>).toString()

  const res = await $fetch(`${config.public.apiBase}/api/meal-group-types/`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })

  return res
})