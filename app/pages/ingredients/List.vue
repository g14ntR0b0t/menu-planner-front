<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router";

const router = useRouter()
interface Ingredient {
  id                  : number,
  name                : string,
  description         : string,
  measure_unit_id     : number,
  measure_unit__name  : string
}
const ingredients         = ref<Ingredient[]>([])
const selected_ingredient = ref<Ingredient | null>(null)
const search_field        = ref('')
const headers             = [
  { title: '#', key: 'id', sortable: true },
  { title: 'Nombre', key: 'name', sortable: true },
  { title: 'Observaciones', key: 'description', sortable: false },
  { title: 'Unidad Medida', key: 'measure_unit__name', sortable: false },
  { title: 'Acciones', key: 'acciones', sortable: false },
]
const show_confirm  = ref<boolean>(false)
const loading_del   = ref<boolean>(false)
const success       = ref<boolean>(false)
onMounted(async () => {
  await getData()
})

const getData = async () => {
  try {
    const data = await $fetch('/api/ingredients/getIngredients', {
      method: 'GET',
    })
    ingredients.value =  data
  }
  catch {}
}
const deleteRecord = async () => {
  loading_del.value = true
  try {
    const response = await $fetch(`/api/ingredients/deleteIngredient/${selected_ingredient.value.id}`, {
      method: "DELETE"
    })
    loading_del.value   = false
    show_confirm.value  = false
    success.value       = true
  }
  catch (err) {
    console.error(err)
  }
}
const refresh = () => {
  window.location.href = ''
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <h1>Ingredientes</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="#6E9075" prepend-icon="mdi-plus" @click="router.push('/ingredients/')">
          Nuevo
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <v-text-field label="Buscar"
                      append-inner-icon="mdi-magnify"
                      v-model="search_field"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="ingredients">
        <v-data-table
                      :items="ingredients"
                      :headers="headers"
                      :items-per-page="100"
                      fixed-header
                      dense
                      class="elevation-1"
                      :search="search_field"
        >
          <template v-slot:item.acciones="{item}">
            <v-btn
                variant="flat"
                color="#6E9075"
                title="Editar"
                size="small"
                @click="router.push(`/ingredients/${item.id}`)"
            >
              <v-icon icon="mdi-clipboard-edit-outline"></v-icon>
            </v-btn>
            <v-btn variant="flat" color="#4E3130" title="Eliminar" size="small" class="ml-2" @click="selected_ingredient=item; show_confirm=true;">
              <v-icon icon="mdi-delete-empty"></v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-dialog v-model="show_confirm" max-width="400">
      <v-card style="padding: 20px">
        <v-card-title class="text-h6">¿Eliminar {{selected_ingredient.name}}?</v-card-title>
        <v-card-text>¿Está seguro que desea eliminar este registro permanentemente?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" @click="show_confirm=false" variant="flat">Cancelar</v-btn>
          <v-btn color="#4E3130" variant="flat" @click="deleteRecord()" :loading="loading_del">Sí, eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="success" max-width="400" persistent>
      <v-card style="padding: 20px">
        <v-card-title class="text-h6">Realizado</v-card-title>
        <v-card-text>Registro eliminado correctamente</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#4E3130" variant="flat" @click="refresh()">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>