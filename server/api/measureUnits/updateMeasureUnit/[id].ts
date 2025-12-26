import { defineEventHandler } from 'h3'
export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const res = await $fetch(`${config.public.apiBase}/api/measure-units/${id}/`, {
    method: "PUT",
    body,
    headers: {
      "Content-Type": "application/json",
    },
  })

  return res
})