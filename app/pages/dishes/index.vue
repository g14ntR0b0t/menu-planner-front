<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()
interface Ingredient {
  id                  : number,
  name                : string,
  description         : string,
  measure_unit_id     : number,
  measure_unit__name  : string
}
interface Type {
  id                  : number,
  name                : string,
  time                : string,
}
interface Unit {
  name          : string,
  abbreviation  : string,
  count         : boolean,
  active        : boolean
}
interface Item {
  ingredient          : Ingredient | null,
  measure_unit        : Unit | null,
  quantity            : number,
  annotations         : string,
}
interface MealGroup {
  id          : number,
  name        : string,
  description : string,
  active      : boolean
}

interface GroupData {
  group : MealGroup,
  item  : Item[],
}

const ingredients         = ref<Ingredient[]>([])
const meal_groups         = ref<MealGroup[]>([])
const measure_units       = ref<Unit[]>([])
const items               = ref<Item[]>([])
const side_dishes         = ref<Item[]>([])
const types               = ref<Type[]>([])
const name                = ref<string>('')
const description         = ref<string>('')
const time                = ref<string>('')
const type_selected       = ref<Type>()
const success             = ref<boolean>(false)
const imageFile           = ref<File | null>(null)
const selected_groups     = ref<MealGroup[]>([])
const total_data          = ref<GroupData[]>([])
onMounted(async () => {
  await getIngredients()
  await getMeasureUnits()
  await getTypes()
  await getMealGroups()
})
function onFileChange(files: File[]) {
  imageFile.value = files
}
const getIngredients = async () => {
  try {
    const data = await $fetch('/api/ingredients/getIngredients', {
      method: 'GET',
    })
    ingredients.value =  data
  }
  catch {}
}
const getMealGroups = async () => {
  try {
    const data = await $fetch('/api/mealGroups/getMealGroups', {
      method: 'GET',
    })
    meal_groups.value = data
  }
  catch {}
}
const getMeasureUnits = async () => {
  try {
      const data = await $fetch('/api/measureUnits/getMeasureUnits', {
      method: 'GET',
    })
    measure_units.value =  data
  }
  catch {}
}
const getTypes = async () => {
  try {
    const data = await $fetch('/api/types/getTypes', {
      method: 'GET',
    })
    types.value =  data
  }
  catch {}
}
const addIngredient = (group_id) => {
  let d = {
    ingredient : null,
    measure_unit : null,
    quantity : 0,
    annotations : '',
  }
  const object = total_data.value.find(entry => entry.group.id === group_id)
  object.item.push(d)
}
const deleteItem = (type, index) => {
  if (type == 'I'){
    items.value.splice(index, 1)
  }
  if (type == 'S') {
    side_dishes.value.splice(index, 1)
  }
}

const submit = async() => {
  const formData = new FormData()

  if (type_selected.value?.id != null) formData.append('type', String(type_selected.value.id))
  if (name.value) formData.append('name', name.value)
  if (description.value) formData.append('description', description.value)

  // Append details as JSON string
  formData.append('data', JSON.stringify(
    total_data.value
  ))

  // Append image if exists
  if (imageFile.value) formData.append('image', imageFile.value)
  try{
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiBase}/api/dish/create/`, {
      method: 'POST',
      body: formData
    })
    success.value       = true
  }
  catch (err){
    console.error(err)
  }

}

watch(selected_groups,(newVal, oldVal) => {
  if (!oldVal) return
  // Added items
  let added = newVal.filter(
    item => !oldVal.some(o => o.id === item.id)
  )

  // Removed items
  let removed = oldVal.filter(
    item => !newVal.some(o => o.id === item.id)
  )
  if (added.length) {
    added = added[0]
    total_data.value.push({
      group : added,
      item  : []
    })
  }
  if (removed.length) {
    removed = removed[0]
    const id = removed.id
    total_data.value  = total_data.value.filter(entry => entry.group.id !== id)
  }
})

</script>

<template>
  <v-container style=" max-width: 1600px" dark>
    <v-row>
      <v-col align="center">
        <h1>Agregar Preparación</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-text-field
            label="Nombre del platillo"
            placeholder="Ej. Huevos revueltos"
            v-model="name"
        ></v-text-field>
      </v-col>
      <v-col cols="6">
        <v-file-input
            label="Imagen de referencia"
            prepend-icon="mdi-camera"
            @update:model-value="onFileChange"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-select label="Tiempo"
                  size="small"
                  :items="types"
                  item-title="name"
                  item-id="id"
                  item-value="id"
                  return-object
                  v-model="type_selected"
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-textarea
            label="Descripción"
            rows="1"
            placeholder="Ingrese alguna observación para esta preparación."
            v-model="description"
        >
        </v-textarea>
      </v-col>
    </v-row>
    <v-card class="mt-5">
      <v-card-title align="center">
        Alimentos
      </v-card-title>
      <v-card-text class="mt-10">
        <v-row>
          <v-col cols="12">
            <v-select
              v-model="selected_groups"
              :items="meal_groups"
              item-title="name"
              return-object
              label="Grupos"
              :list-props="{ bgColor: '#A1887F' }"
              item-color="white"
              chips
              multiple
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-show="selected_groups.length" elevation="4">
          <v-col cols="12" lg="6" md="6" xl="6" v-for="(group, idx) in selected_groups" :key="idx">
            <v-card style="height: 400px; overflow-y: auto;" color="#ECEFF1">
              <v-card-title>
                <v-row justify="center">
                  <v-col cols="12" align="center">
                    {{group.name}}
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-table>
                  <thead>
                  <tr >
                    <th>Alimento</th>
                    <th>Cantidad</th>
                    <th>Unidad</th>
                    <th>Acciones</th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idxi) in total_data.find(entry => entry.group.id === group.id).item" :key="idxi">
                      <td>
                        <v-select label="Alimento"
                                  size="small"
                                  :items="ingredients"
                                  item-title="name"
                                  item-id="id"
                                  item-value="id"
                                  return-object
                                  v-model="item.ingredient"
                        ></v-select>
                      </td>
                      <td>
                        <v-text-field type="number"
                                      placeholder="0 para cantidad al gusto"
                                      v-model="item.quantity"
                        >
                        </v-text-field>
                      </td>
                      <td>
                        <v-select label="Unidad"
                                  size="small"
                                  :items="measure_units"
                                  item-title="name"
                                  item-id="id"
                                  item-value="id"
                                  return-object
                                  v-model="item.measure_unit"
                        ></v-select>
                      </td>
                      <td>
                        <v-btn variant="flat"
                               color="red-darken-4"
                               title="Quitar de la lista"
                               class="ml-2"
                               @click="deleteItem('I', idx)"
                        >
                          <v-icon icon="mdi-delete-forever-outline"></v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
                <v-row justify="center" class="mt-2">
                  <v-col cols="12" align="center">
                    <v-btn variant="outlined" size="x-large" @click="addIngredient(group.id)">
                      <v-icon icon="mdi-plus"></v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <br>
    <v-row justify="center">
      <v-col cols="12" align="end">
        <v-btn variant="flat" color="#4E3130" prepend-icon="mdi-content-save" @click="submit">
          Guardar
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog v-model="success" max-width="400" persistent>
      <v-card style="padding: 20px">
        <v-card-title class="text-h6">Realizado</v-card-title>
        <v-card-text>Preparación agregada correctamente</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#4E3130" variant="flat" @click="router.push('/dishes/list')">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
table thead th {
  font-weight: bold!important;
}
</style>