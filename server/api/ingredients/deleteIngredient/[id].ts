export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const config = useRuntimeConfig()

  const res = await $fetch(`${config.public.apiBase}/api/ingredients/${id}/`, {
    method: "DELETE",
  })

  return res
})