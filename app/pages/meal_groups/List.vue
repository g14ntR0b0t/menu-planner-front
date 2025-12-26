<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter()

interface MealGroupType {
  id          : number,
  name        : string,
  description : string,
}
const groups          = ref<MealGroupType[]>([])
const show_confirm    = ref<boolean>(false)
const selected_group  = ref<MealGroupType | null>(null)
const loading_del     = ref<boolean>(false)
const success         = ref<boolean>(false)

onMounted(async () => {
  await getData()
})

const getData = async () => {
  try {
    const data = await $fetch('/api/mealGroups/getMealGroups', {
      method: 'GET',
    })
    groups.value =  data
  }
  catch {}
}

const refresh = () => {
  window.location.href = ''
}
const deleteRecord = async () => {
  loading_del.value=true
  try {
    const response = await $fetch(`/api/mealGroups/deleteGroup/${selected_group.value.id}`, {
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
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" align="center">
        <h1>Grupos</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="#6E9075"
               prepend-icon="mdi-plus"
               @click="router.push('/meal_groups/')"
        >
          Nuevo
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-10">
      <v-col>
        <v-table v-if="groups" height="300px">
          <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Observaciones</th>
            <th>Activo</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in groups">
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.description}}</td>
            <td v-if="item.active">
              <v-icon class="text-success" icon="mdi-check-circle"></v-icon>
            </td>
            <td v-else>
              <v-icon class="text-danger" icon="mdi-close-circle"></v-icon>
            </td>
            <td>
              <v-btn variant="flat"
                     color="#6E9075"
                     title="Editar"
                     size="small"
                     @click="router.push(`/meal_groups/${item.id}`)"
              >
                <v-icon icon="mdi-clipboard-edit-outline"></v-icon>
              </v-btn>
              <v-btn variant="flat"
                     color="#4E3130"
                     title="Eliminar"
                     size="small"
                     class="ml-2"
                     @click="selected_group=item; show_confirm=true"
              >
                <v-icon icon="mdi-delete-empty"></v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-dialog v-model="show_confirm" max-width="400">
      <v-card style="padding: 20px">
        <v-card-title class="text-h6">¿Eliminar {{selected_group.name}}?</v-card-title>
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