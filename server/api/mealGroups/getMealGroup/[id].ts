import { defineEventHandler } from 'h3'
export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const config = useRuntimeConfig()
  // fetch specific record
  return await $fetch(`${config.public.apiBase}/api/meal-group-types/${id}/`, {
    method: "GET"
  })
})