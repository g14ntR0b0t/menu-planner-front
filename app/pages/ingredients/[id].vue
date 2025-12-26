<script setup lang="ts">
import {ref, onMounted, computed} from "vue";
import { useRouter, useRoute } from "vue-router";

interface Ingredient {
  id                  : number,
  name                : string,
  description         : string,
  measure_unit        : number | null,
  measure_unit__name  : string | null,
  measure_unit_id     : number | null,
}

interface Unit {
  name          : string,
  abbreviation  : string,
  count         : boolean,
  active        : boolean
}

const route                 = useRoute()
const router                = useRouter()
const form                  = ref()
const id                    = computed(() => route.params.id ?? null)
const measure_units         = ref<Unit[]>([])
const ingredient            = ref<Ingredient | null>(null)
const error                 = ref<boolean>(false)
const error_msg             = ref<string>('')
const success               = ref<boolean>(false)
const ingredient_name       =  ref<string>('')
const measure_unit_selected = ref({id: null, name: '', abbreviation: '', count:false, active: false})
const image                 = ref<File | null>(null)


onMounted(async () => {
  await getMeasureUnits()
  await getData()
})
const getMeasureUnits = async () => {
  try {
      const data = await $fetch('/api/measureUnits/getMeasureUnits', {
      method: 'GET',
    })
    measure_units.value =  data
  }
  catch {}
}
const getData = async() => {
  try{
    const response = await $fetch(`/api/ingredients/getIngredient/${id.value}`, {
      method: 'GET',
      params : {}
    })
    ingredient.value      = response
    ingredient_name.value = response.name
    const tmp_measure = measure_units.value.find( (item) => item.id === ingredient.value.measure_unit_id)
    measure_unit_selected.value = tmp_measure
  }
  catch (err){
    error.value =  true
    error_msg.value = err?.data?.data?.detail
  }
}
const submit = async () => {
  const { valid } = await form.value.validate()
  if (valid){
    const formData = new FormData()
    if (ingredient.value.name) formData.append('name', String(ingredient.value.name))
    if (ingredient.value.description) formData.append('description', String(ingredient.value.description))
    if (measure_unit_selected.value?.id != null) formData.append('measure_unit', String(measure_unit_selected.value.id))
    // Append image if exists
    if(image.value) formData.append('image', image.value)
    try{
      const config = useRuntimeConfig()
      const response = await $fetch(`${config.public.apiBase}/api/ingredients/${id.value}/`, {
        method: 'PUT',
        body: formData
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
    <v-form ref="form" v-if="ingredient">
      <v-row>
        <v-col cols="12" align="center">
          <h1>Ingrediente: {{ingredient_name}}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="end">
          <v-btn variant="flat"
                 color="#4E3130"
                 size="small"
                 prepend-icon="mdi-format-list-bulleted"
                 @click="router.push('/ingredients/list')"
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
                  v-model="ingredient.name"
                  variant="outlined"
                  :rules="[v => !!v || 'Es necesario ingresar un nombre.']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-select label="Unidad de Medida"
                        variant="outlined"
                        :items="measure_units"
                        item-title="name"
                        item-id="id"
                        item-value="id"
                        return-object
                        v-model="measure_unit_selected"
                        :rules="[v => !!v.id || 'Es necesario ingresar una unidad de medida.']"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-file-input
                  prepend-icon="mdi-camera"
                  v-model="image"
                  label="Imagen"
                  accept="image/*"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                  label="Observaciones"
                  v-model="ingredient.description"
                  variant="outlined"
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
        <v-card-text>El registro fue guardado correctamente.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="router.push('/ingredients/list')">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>