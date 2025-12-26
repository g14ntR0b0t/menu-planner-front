<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router";

const router  = useRouter()
const form    = ref()

const name      = ref<string>('')
const desc      = ref<string>('')
const active    = ref<boolean>(true)
const error     = ref<boolean>(false)
const error_msg = ref<string>('')
const success   = ref<boolean>(false)

const submit = async () => {
  const { valid } = await form.value.validate()
  if (valid) {
    try{
      const response = await $fetch('/api/mealGroups/saveMealGroup', {
        method: 'POST',
        body: {
          name           : name.value,
          description    : desc.value,
          active         : active.value
        }
      })
      success.value =  true
    }
    catch (err) {
      console.error(err.data.data)
      const data = err?.data?.data
      const msg = Object.entries(data)
      .map(([key, values]) => `${key}: ${values.join(", ")}`)
      .join(" | ");
      error_msg.value   =  `[ERROR ${err?.status}] - Oops el siguiente error: ${msg}`
      error.value       =  true
    }
  }
}
</script>

<template>
  <v-container style="max-width: 1600px;">
    <v-form ref="form">
      <v-row>
        <v-col cols="12" align="center">
          <h1>Agregar Grupo</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="end">
          <v-btn variant="flat"
                 color="#4E3130"
                 size="small"
                 prepend-icon="mdi-format-list-bulleted"
                 @click="router.push('/meal_groups/list')"
          >
            Listado
          </v-btn>
        </v-col>
      </v-row>
      <v-card variant="elevated"
              style="padding: 30px;"
              class="mt-10"
              elevation="5">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  label="Nombre"
                  v-model="name"
                  variant="outlined"
                  :rules="[v => !!v || 'Es necesario ingresar un nombre']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field label="Descripción"
                            v-model="desc"
                            variant="outlined"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-checkbox
                  v-model="active"
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
              <v-btn
                  variant="flat"
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
      {{ error_msg }}
      <template v-slot:actions>
        <v-btn
            color="red"
            variant="text"
            @click="error=false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog
        v-model="success"
        max-width="400"
        persistent
    >
      <v-card>
        <v-card-title class="text-h6">Éxito</v-card-title>
        <v-card-text>
          El regirstro fue guardado correctamente
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
              color="primary"
              @click="router.push('/meal_groups/list')"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>

</style>