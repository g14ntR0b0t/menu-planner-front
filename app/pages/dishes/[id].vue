<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const route   = useRoute()
const router  = useRouter()

interface MealGroupDetail {
  annotations             : string | null,
  ingredient__name        : string,
  ingredient_id           : number,
  ingredient__image__url  : string | null,
  measure_unit__name      : string,
  measure_unit_id         : number,
  quantity                : number
}

interface Dish {
  id          : number,
  name        : string,
  description : string | null,
  image       : string,
  type__name  : string,
  type_id     : number,
  meal_group_details  : MealGroupDetail[]
}

const id          = computed(() => route.params.id ?? null)
const dish        = ref<Dish>()
const error       = ref<boolean>(false)
const error_msg   = ref<string>('')
const types_style = ref([
  {type: 'Desayuno',  icon: 'weather-sunset-up',      color: 'orange-darken-2'},
  {type: 'Comida',    icon: 'weather-partly-cloudy',  color: 'light-green-darken-2'},
  {type: 'Cena',      icon: 'weather-night',          color: 'indigo-darken-4'},
])
const getData = async () => {
  try {
    const response = await $fetch(`/api/dishes/getDishDetail/${id.value}`, {
      method  : 'GET',
      params  : {}
    })
    dish.value = response
  }
  catch (err){
    error.value = true
    error_msg.value = err?.data?.data?.detail
    console.error(err)
  }
}

const formatQuantity = (qty: number) => {
  if (Number.isInteger(qty)) return qty.toString()

  const whole = Math.floor(qty)
  const decimal = qty - whole

  const fractions: Record<number, string> = {
    0.25: '1/4',
    0.5: '1/2',
    0.75: '3/4'
  }

  const fraction = fractions[decimal] ?? qty.toString()

  return whole > 0 ? `${whole} ${fraction}` : fraction
}

const formatUnit = (unit: string, qty: number) =>
  qty === 1 ? unit : `${unit}(s)`

const getTypeIcon = (type_name) => {
  const style = types_style.value.find((item) => item.type == type_name)
  return style ? style.icon : ''
}
const getTypeColor = (type_name) => {
  const style = types_style.value.find( (item) => item.type == type_name )
  return style ? style.color : ''
}

onMounted(async () => {
  await getData()
})
const grouped_items = computed(() => {
  return dish.value.meal_group_details.reduce((acc, item) => {
    const groupId = item.meal_group_type_id

    if (!acc[groupId]) {
      acc[groupId] = {
        id: groupId,
        name: item.meal_group_type__name,
        items: []
      }
    }

    acc[groupId].items.push(item)
    return acc
  }, {} as Record<number, any>)
})

</script>

<template>
  <v-container style="max-width: 1300px;" v-if="dish" class="mt-5">
    <v-row justify="center">
      <v-col cols="12" md="6" lg="6" xl="6" align="left">
        <v-row>
          <v-col>
            <h1>
              {{ dish.name }}
              <v-chip :color="getTypeColor(dish.type__name)" size="x-large" align="right">
                <v-icon :icon="'mdi-' + getTypeIcon(dish.type__name)"></v-icon>
                {{ dish.type__name }}
              </v-chip>
            </h1>

          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-img
                class="elevation-5"
                height="auto"
                widht="auto"
                :src="dish.image"
                cover
            ></v-img>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="mt-10">
      <v-col  cols="12">
        <v-row>
          <v-col
            v-for="group in grouped_items"
            :key="group.id"
            cols="12"
            lg="6"
            xl="6"
            md="12"
          >
            <v-card elevation="4">
              <v-card-title class="text-h6">
                {{ group.name }}
              </v-card-title>

              <v-divider />

              <v-card-text style="height: 250px; overflow-y: auto">
                <v-list >
                  <v-list-item
                    v-for="item in group.items"
                    :key="item.ingredient_id"
                  >
                    <template #prepend>
                      <v-avatar size="60">
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
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

</style>