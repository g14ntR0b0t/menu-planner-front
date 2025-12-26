export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const config = useRuntimeConfig()

  return await $fetch(`${config.public.apiBase}/api/ingredients/${id}/`, {
    method: "GET"
  })
})