<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from "vue-router";

const route   = useRoute()
const router  = useRouter()
interface Type {
  id            : number,
  name          : string,
  annotations   : string,
  time          : string,
}
const id          = computed(() => route.params.id ?? null)
const type        = ref<Type | null>(null)
const form        = ref()
const error       = ref<boolean>(false)
const error_msg   = ref<string>('')
const success     = ref<boolean>(false)
const name        = ref<string>('')

onMounted(async () => {
  await getData()
})

const getData = async() => {
  try{
    const response = await $fetch(`/api/types/getType/${id.value}`, {
      method: 'GET',
      params : {}
    })
    let time = response.time
    type.value =  response
    type.value.time = time.slice(0, 5)
    name.value = response.name
  }
  catch (err){
    error.value =  true
    error_msg.value = err?.data?.data?.detail
  }
}
const submit = async () =>{
  const { valid } = await form.value.validate()
  if (valid) {
    try{
      const response = await $fetch(`/api/types/updateType/${id.value}`, {
        method: 'PUT',
        body: {
          name          : type.value.name,
          annotations   : type.value.annotations,
          time          : type.value.time + ':00'
        }
      })
      success.value =  true
    }
    catch (err) {
      let msg = ''
      console.error('Data:', err?.data)
      err?.data?.data?.annotations.forEach(
          (annotation) => {
            msg += annotation
          }
      )
      error_msg.value   =  `[ERROR ${err?.status}] - Oops el siguiente error: ${msg}`
      error.value       =  true
    }
  }
}
</script>

<template>
  <v-container style=" max-width: 1600px" v-if="type">
    <v-form ref="form">
      <v-row>
        <v-col cols="12" align="center">
          <h1>Tiempo: {{name}}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="end">
          <v-btn variant="flat"
                 color="#4E3130"
                 size="small"
                 prepend-icon="mdi-format-list-bulleted"
                 @click="router.push('/types/list')"
          >
            Listado
          </v-btn>
        </v-col>
      </v-row>
      <v-card variant="elevated" style="padding: 30px;" elevation="5" class="mt-10">
        <v-card-text >
          <v-row>
            <v-col cols="12">
              <v-text-field
                  label="Nombre"
                  v-model="type.name"
                  variant="outlined"
                  :rules="[v => !!v || 'Es necesario ingresar un nombre.']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-time-picker v-model="type.time"
                             color="#7DD8BB"
                             size="x-small"
                             :rules="[v => !!v || 'Es necesario establecer un horario.']"
              ></v-time-picker>
            </v-col>
            <v-col cols="12" v-show="!type.time">
              <v-alert
                type="error"
                variant="outlined"
              >
                Es necesario establecer un horario.
              </v-alert>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea label="Observaciones"
                          v-model="type.annotations"
                          rows="5"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions align="end">
          <v-row>
            <v-col cols="12" align="end">
              <v-btn variant="flat"
                     prepend-icon="mdi-content-save"
                     color="#4E3130"
                     @click="submit"
              >
                Guardar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-snackbar
      v-model="error"
      multi-line
    >
      {{error_msg}}
      <template v-slot:actions>
        <v-btn
          color="red"
          variant="text"
          @click="error = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="success" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Éxito</v-card-title>
        <v-card-text>El registro fue actualizado correctamente.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="router.push('/types/list')">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>