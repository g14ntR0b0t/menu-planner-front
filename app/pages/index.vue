<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { VCalendar } from 'vuetify/labs/VCalendar'
import getMeals from "../../server/api/meal/getMeals";

interface DishDetail {
    ingredient_id       : number,
    ingredient__name    : string,
    measure_unit_id     : number,
    measure_unit__name  : string,
    quantity            : number,
    annotations         : string
  }
interface Dish {
  id                  : number,
  name                : string,
  description         : string,
  type_id             : number,
  type__name          : string,
  image               : string,
  meal_group_details  : DishDetail[],
  expand              : boolean,
}

const add_meal        = ref<boolean>(false)
const loading_save    = ref<boolean>(false)
const dishes          = ref<Dish[]>([])
const filtered_dishes = ref<Dish[]>([])
const filter_type_selected    = ref<string>('')
const filter_name           = ref<string>('')
const selected_dish   = ref<Dish | null>(null)
const image                 = ref<File | null>(null)
const types_style   = ref([
  {type: 'Desayuno',  icon: 'weather-sunset-up',      color: 'amber-darken-1'},
  {type: 'Comida',    icon: 'weather-partly-cloudy',  color: 'light-green-darken-2'},
  {type: 'Cena',      icon: 'weather-night',          color: 'indigo-darken-4'},
])

const error                 = ref<boolean>(false)
const error_msg             = ref<string>('')
const success               = ref<boolean>(false)

// Calendar variables
const type = ref('week')
const types = ['month', 'week', 'day', '4day']
const mode = ref('stack')
const weekday = ref([0, 1, 2, 3, 4, 5, 6])
const weekdays = [
  { title: 'Dom - Sáb', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Lun - Dom', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: 'Lun - Vie', value: [1, 2, 3, 4, 5] },
  { title: 'Lun, Mié, Vie', value: [1, 3, 5] },
]
const value = ref('')
const events = ref([])
const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey-darken-1']
const names = ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']
interface CalendarClickPayload {
  event: {
    dish_id : number,
    name  : string,
    start : string,
    end   : string,
    color : string,
    timed: boolean
  }
}
function rnd (a, b) {
  return Math.floor((b - a + 1) * Math.random()) + a
}
//const getEvents = async ({ start, end }) => {
const getEvents = async () => {
  /**
  const evts = []

  const min = new Date(`${start.date}T00:00:00`)
  const max = new Date(`${end.date}T23:59:59`)
  const days = (max.getTime() - min.getTime()) / 86400000
  const eventCount = rnd(days, days + 20)

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0
    const firstTimestamp = rnd(min.getTime(), max.getTime())
    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000
    const second = new Date(first.getTime() + secondTimestamp)

    evts.push({
      name: names[rnd(0, names.length - 1)],
      start: first,
      end: second,
      color: colors[rnd(0, colors.length - 1)],
      timed: !allDay,
    })
  }

  events.value = evts
   **/
  try {
    const data = await $fetch('/api/meal/getMeals', {
      method: 'GET',
    })
    const evts = []
    data.forEach((item) => {
      const date = new Date(item.date)
      let end_date = new Date(item.date)
      end_date = end_date.setHours(end_date.getHours() + 1)
      evts.push({
        dish_id : item.dish_id,
        name  : item?.dish__name,
        start : date,
        end   : end_date,
        color : getTypeColor(item.type__name),
        timed: true
      })
    })
    events.value = evts
  }
  catch {}
}
function getEventColor (event) {
  return event.color
}

const getTypeIcon = (type_name) => {
  const style = types_style.value.find((item) => item.type == type_name)
  return style ? style.icon : ''
}
const getTypeColor = (type_name) => {
  const style = types_style.value.find( (item) => item.type == type_name )
  return style ? style.color : ''
}

const registerMeal = async () => {
  loading_save.value = true
  const formData = new FormData()
  if (selected_dish.value?.id != null) formData.append('dish_id', String(selected_dish.value.id))
  if (selected_dish.value?.type_id != null) formData.append('type_id', String(selected_dish.value.type_id))
  if(image.value) formData.append('image', image.value)
  try {
    const config = useRuntimeConfig()
    const response = await $fetch(`${config.public.apiBase}/api/meals/`, {
        method: 'POST',
        body: formData
      })
      success.value =  true
  }
  catch (err){
    alert(err)
    loading_save.value = false
  }
}

const filterDish = () => {
    if (filter_name.value !== '') {
      filtered_dishes.value =  dishes.value.filter( (item) => item.name.includes(filter_name.value) )
    }
    else {
      filtered_dishes.value = dishes.value
    }
  }

const getDishes = async () => {
  try{
    const response = await $fetch('/api/dishes/getDishes',{
      method: 'GET',
    })
    dishes.value = response
    dishes.value.forEach((dish) => { dish.expand = false })
    filtered_dishes.value = dishes.value
  }
  catch{}
}
const formatQuantity = (qty: number) => {
  if (Number.isInteger(qty)) return qty.toString()

  const whole = Math.floor(qty)
  const decimal = qty - whole

  const fractions: Record<number, string> = {
    0.25  : '1/4',
    0.3   : '1/3',
    0.5   : '1/2',
    0.75  : '3/4'
  }

  const fraction = fractions[decimal] ?? qty.toString()

  return whole > 0 ? `${whole} ${fraction}` : fraction
}

const formatUnit = (unit: string, qty: number) =>
  qty <= 1 ? unit : `${unit}(s)`

const refresh = () => {
  window.location.href = ''
}

const goToEvent = ({ event }: CalendarClickPayload) => {
  console.log(event)
}

onMounted(async () => {
  await getEvents()
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
    <v-row justify="center" class="my-5">
      <v-col align="center">
        <v-btn variant="tonal"
               prepend-icon="mdi-plus"
               color="#4E3130"
               size="large"
               text="Registrar Comida"
               @click="add_meal=true"
        >
        </v-btn>
      </v-col>
    </v-row>
    <v-sheet class="d-flex" tile>
      <v-btn
        class="ma-2"
        variant="text"
        icon
        @click="$refs.calendar.prev()"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        v-model="type"
        :items="types"
        class="ma-2"
        density="comfortable"
        label="Tipo"
        variant="outlined"
        hide-details
      ></v-select>
      <v-select
        v-model="weekday"
        :items="weekdays"
        class="ma-2"
        density="comfortable"
        label="Días Semana"
        variant="outlined"
        hide-details
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn
        class="ma-2"
        variant="text"
        icon
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        locale="es"
        ref="calendar"
        v-model="value"
        :event-color="getEventColor"
        :event-overlap-mode="mode"
        :event-overlap-threshold="30"
        :events="events"
        :type="type"
        :weekdays="weekday"
        @change="getEvents"
        @click:event="goToEvent"
      ></v-calendar>
    </v-sheet>
    <v-dialog v-model="add_meal" max-width="1200">
      <v-card class="mx-auto px-5" min-width="1200" elevation="5">
        <v-card-title class="bg-brown-darken-1 text-white d-flex justify-space-between">
          Registrar Comida
          <v-btn icon variant="text" @click="add_meal=false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <h3>Filtrar por:</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field label="Nombre" v-model="filter_name" @keyup="filterDish()"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-select :items="['Todos', 'Desayuno', 'Comida', 'Cena']"
                        label="Tiempo"
                        v-model="filter_type_selected"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12" md="4" lg="4" xl="4" v-for="dish in filtered_dishes">
              <v-card
                class="mx-auto my-12"
                max-width="374"
                border
                @click="selected_dish=dish"
                style="cursor:pointer;"
                :class="{'selected-dish': dish?.id == selected_dish?.id}"
                elevation="5"
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
                <v-expand-transition>
                  <div v-if="dish.expand">
                    <v-list >
                      <v-list-item
                        v-for="item in dish.meal_group_details"
                        :key="item.ingredient_id"
                      >
                        <template #prepend>
                          <v-avatar size="70">
                            <v-img :src="item.ingredient__image__url" />
                          </v-avatar>
                        </template>

                        <v-list-item-title>
                          {{ item.ingredient__name }}
                        </v-list-item-title>

                        <v-list-item-subtitle>
                          {{ formatQuantity(item.quantity) }} {{ formatUnit(item.measure_unit__name, item.quantity) }}
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-expand-transition>
                <v-card-actions>
                  <v-btn
                    :text="!dish.expand ? 'Ver Más' : 'Ver Menos'"
                    @click="dish.expand = !dish.expand"
                  ></v-btn>
                </v-card-actions>
                <v-divider class="mx-4 mb-1"></v-divider>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-file-input
                  prepend-icon="mdi-camera"
                  v-model="image"
                  label="Foto"
                  accept="image/*"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#4E3130" variant="flat" @click="registerMeal()" :loading="loading_save">Registrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="success" max-width="400" persistent>
      <v-card style="padding: 20px">
        <v-card-title class="text-h6">Realizado</v-card-title>
        <v-card-text>Comida registrada correctamente.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="#4E3130" variant="flat" @click="refresh()">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.selected-dish {
  border: 3px solid #558B2F;
}
</style>