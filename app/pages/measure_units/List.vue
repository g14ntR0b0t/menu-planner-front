<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router";

const router = useRouter()
interface MeasureUnit {
  id                  : number,
  name                : string,
  abbreviation        : string,
  active              : boolean,
  count               : boolean,
}
const measure_units = ref<MeasureUnit[]>([])
const show_confirm  = ref<boolean>(false)
const selected_item = ref<MeasureUnit | null>(null)
const loading_del   = ref<boolean>(false)
const success       = ref<boolean>(false)
onMounted(async () => {
  await getData()
})

const getData = async () => {
  try {
    const data = await $fetch('/api/measureUnits/getMeasureUnits', {
      method: 'GET',
    })
    measure_units.value =  data
  }
  catch {}
}
const refresh = () => {
  window.location.href = ''
}
const deleteRecord = async () => {
  loading_del.value=true
  try {
    const response = await $fetch(`/api/measureUnits/deleteMeasureUnit/${selected_item.value.id}`, {
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
        <h1>Unidades de Medida</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn color="#6E9075" prepend-icon="mdi-plus" @click="router.push('/measure_units')">
          Nuevo
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="mt-10">
      <v-col>
        <v-table v-if="measure_units">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Abreviación</th>
              <th>Contable</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in measure_units">
              <td>{{item.id}}</td>
              <td>{{item.name}}</td>
              <td>{{item.abbreviation}}</td>
              <td v-if="item.count">
                <v-icon class="text-success" icon="mdi-check-circle"></v-icon>
              </td>
              <td v-else>
                <v-icon color="red" icon="mdi-close-circle"></v-icon>
              </td>
              <td v-if="item.active">
                <v-icon class="text-success" icon="mdi-check-circle"></v-icon>
              </td>
              <td v-else>
                <v-icon class="text-danger" icon="mdi-close-circle"></v-icon>
              </td>

              <td>
                <v-btn
                    variant="flat"
                    color="#6E9075"
                    title="Editar"
                    size="small"
                    @click="router.push(`/measure_units/${item.id}`)"
                >
                  <v-icon icon="mdi-clipboard-edit-outline"></v-icon>
                </v-btn>
                <v-btn variant="flat"
                       color="#4E3130"
                       title="Eliminar"
                       size="small"
                       class="ml-2"
                       @click="selected_item=item; show_confirm=true"
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
        <v-card-title class="text-h6">¿Eliminar {{selected_item.name}}?</v-card-title>
        <v-card-text>¡Este registro se eliminará definitivamente!</v-card-text>
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