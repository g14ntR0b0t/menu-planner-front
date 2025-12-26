<script setup lang="ts">
import { computed, ref, onMounted} from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router  = useRouter()
const route   = useRoute()
interface Unit {
  name          : string,
  abbreviation  : string,
  count         : boolean,
  active        : boolean
}
const form          = ref()
const id            = computed(() => route.params.id ?? null)
const unit          = ref<Unit | null>(null)
const error         = ref<boolean>(false)
const error_msg     = ref<string>('')
const success       = ref<boolean>(false)

onMounted(async () => {
  await getData()
})

const getData = async() => {
  try{
    const response = await $fetch(`/api/measureUnits/getMeasureUnit/${id.value}`, {
      method: 'GET',
      params : {}
    })
    unit.value = response
  }
  catch (err){
    error.value =  true
    error_msg.value = err?.data?.data?.detail
  }
}
const submit = async () => {
  const { valid } = await form.value.validate()
  if (valid) {
    try{
      const response = await $fetch(`/api/measureUnits/updateMeasureUnit/${id.value}`, {
        method: 'POST',
        body: {
          name           : unit.value.name,
          abbreviation   : unit.value.abbreviation,
          count          : unit.value.count,
          active         : unit.value.active
        }
      })
      success.value =  true
    }
    catch (err) {
      let msg = ''
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
  <v-container style=" max-width: 1600px">
    <v-form ref="form" v-if="unit">
      <v-row>
        <v-col cols="12" align="center">
          <h1>Agregar Unidad de Medida</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="end">
          <v-btn variant="flat"
                 color="#4E3130"
                 size="small"
                 prepend-icon="mdi-format-list-bulleted"
                 @click="router.push('/measure_units/list')"
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
                  v-model="unit.name"
                  variant="outlined"
                  :rules="[v => !!v || 'Es necesario ingresar un nombre.']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  label="Abreviación"
                  v-model="unit.abbreviation"
                  variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-checkbox
                v-model="unit.count"
                color="#563635"
                label="Contable"
                hide-details
              ></v-checkbox>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-checkbox
                v-model="unit.active"
                color="#563635"
                label="Activo"
                hide-details
              ></v-checkbox>
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
          <v-btn color="primary" @click="router.push('/measure_units/list')">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>