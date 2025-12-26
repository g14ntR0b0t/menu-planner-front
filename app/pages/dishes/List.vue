<script setup lang="ts">
  import { ref, onMounted, watch } from "vue"
  import { useRouter } from 'vue-router'

  const loading = ref(false)
  const router  = useRouter()
  interface DishDetail {
    ingredient_id       : number,
    ingredient__name    : string,
    measure_unit_id     : number,
    measure_unit__name  : string,
    quantity            : number,
    annotations         : string
  }
  interface Dish {
    id    : number,
    name  : string,
    description   : string,
    type_id       : number,
    type__name    : string,
    image         : string
    meal_group_details  : DishDetail[]
  }
  const filter_type_selected  = ref<string>('')
  const filter_name           = ref<string>('')

  const dishes          = ref<Dish[]>([])
  const filtered_dishes = ref<Dish[]>([])
  const selected_dish   = ref<Dish | null>(null)
  const show_confirm  = ref<boolean>(false)
  const loading_del   = ref<boolean>(false)
  const success       = ref<boolean>(false)
  const types_style   = ref([
    {type: 'Desayuno',  icon: 'weather-sunset-up',      color: 'amber-darken-1'},
    {type: 'Comida',    icon: 'weather-partly-cloudy',  color: 'light-green-darken-2'},
    {type: 'Cena',      icon: 'weather-night',          color: 'indigo-darken-4'},
  ])
  const getDishes = async () => {
    try{
      const response = await $fetch('/api/dishes/getDishes',{
        method: 'GET',
      })
      dishes.value = response
      filtered_dishes.value = dishes.value
    }
    catch{}
  }
  const getTypeIcon = (type_name) => {
    const style = types_style.value.find((item) => item.type == type_name)
    return style ? style.icon : ''
  }
  const getTypeColor = (type_name) => {
    const style = types_style.value.find( (item) => item.type == type_name )
    return style ? style.color : ''
  }
  const filter = () => {
    if (filter_name.value !== '') {
      filtered_dishes.value =  dishes.value.filter( (item) => item.name.includes(filter_name.value) )
    }
    else {
      filtered_dishes.value = dishes.value
    }
  }

  const deleteDish = async () => {
    loading_del.value = true
    try {
      const response = await $fetch(`/api/dishes/deleteDish/${selected_dish.value.id}`, {
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

  onMounted(async() => {
    await getDishes()
    filter_type_selected.value = 'Todos'
  })
  watch(filter_type_selected, (newVal, oldVal) => {
    if (newVal == 'Todos'){
      filtered_dishes.value = dishes.value
    }
    else {
      filtered_dishes.value = dishes.value.filter((item) => item.type__name == newVal)
    }
  })

</script>

<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>Filtrar por:</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" md="6" lg="4" xl="4">
        <v-text-field label="Nombre" v-model="filter_name" @keyup="filter()"></v-text-field>
      </v-col>
      <v-col cols="6" md="6" lg="4" xl="4">
        <v-select :items="['Todos', 'Desayuno', 'Comida', 'Cena']"
                  label="Tiempo"
                  v-model="filter_type_selected"
        >
        </v-select>
      </v-col>
      <v-col cols="3">
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="4" xl="4">
        <v-btn variant="tonal"
               prepend-icon="mdi-plus"
               color="#4E3130"
               @click="router.push('/dishes/')"
               size="large"
        >
          Agregar Preparación
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-show="!dishes.length">
      <v-col cols="12">
        <v-card elevation="3">
          <v-card-text style="background-color: #e5e5e5;">
            <v-img
              height="250"
              src="/images/not_found_dishes.png"
            ></v-img>
            <h2>Ooops.</h2>
            <h3 class="text-gray-500/75">¡Comienza agregando una preparación!</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="4" lg="3" xl="3" v-for="dish in filtered_dishes">
        <v-card
          :disabled="loading"
          :loading="loading"
          class="mx-auto my-12"
          max-width="374"
          border
        >
          <template v-slot:loader="{ isActive }">
            <v-progress-linear
              :active="isActive"
              color="deep-purple"
              height="4"
              indeterminate
            ></v-progress-linear>
          </template>

          <v-img
            height="250"
            :src="dish.image"
            cover
          ></v-img>

          <v-card-item>
            <v-card-title>{{ dish.name }}</v-card-title>
          </v-card-item>
          <div class="px-4 mb-2">
            <v-chip :color="getTypeColor(dish.type__name)">
              <v-icon :icon="'mdi-' + getTypeIcon(dish.type__name)"></v-icon>
              {{ dish.type__name }}
            </v-chip>
          </div>
          <v-card-text>
            <v-chip-group>
              <v-chip v-for="ingredient in dish.meal_group_details">
                {{ ingredient.ingredient__name }}
              </v-chip>
            </v-chip-group>
          </v-card-text>

          <v-divider class="mx-4 mb-1"></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="#563635"
              icon="mdi-eye"
              size="large"
              title="Ver Preparación"
              @click="router.push(`/dishes/${dish.id}`)"
            ></v-btn>
            <v-btn
              color="#563635"
              icon="mdi-heart"
              title="Favorito"
            ></v-btn>
            <v-btn
              color="red-darken-4"
              icon="mdi-delete"
              size="small"
              title="Eliminar"
              @click="selected_dish=dish; show_confirm=true;"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="show_confirm" max-width="400">
      <v-card style="padding: 20px">
        <v-card-title class="text-h6">¿Eliminar {{selected_dish.name}}?</v-card-title>
        <v-card-text>¿Está seguro que desea eliminar este registro permanentemente?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red" @click="show_confirm=false" variant="flat">Cancelar</v-btn>
          <v-btn color="#4E3130" variant="flat" @click="deleteDish()" :loading="loading_del">Sí, eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="success" max-width="400" persistent>
      <v-card style="padding: 20px">
        <v-card-title class="text-h6">Realizado</v-card-title>
        <v-card-text>Preparación eliminada correctamente.</v-card-text>
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