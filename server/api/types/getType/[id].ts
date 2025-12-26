export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const config = useRuntimeConfig()

  // fetch specific record
  return await $fetch(`${config.public.apiBase}/api/types/${id}/`, {
    method: "GET"
  })
})