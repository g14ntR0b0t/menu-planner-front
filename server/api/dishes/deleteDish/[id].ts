import { defineEventHandler } from 'h3'
export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const config = useRuntimeConfig()
  const res = await $fetch(`${config.public.apiBase}/api/dishes/${id}/`, {
    method: "DELETE",
  })

  return res
})