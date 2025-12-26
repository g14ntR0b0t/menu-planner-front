import { defineEventHandler } from 'h3'
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig()

  return await $fetch(`${config.public.apiBase}/api/dishes`, {
    method: "GET",
    params: query,
  })
})