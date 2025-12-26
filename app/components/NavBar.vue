<script setup lang="ts">
import { ref, onMounted } from 'vue'
const drawer    = ref(false)

const logout = () => {}
</script>

<template>
  <v-app-bar app color="#78C091" class="pr-5" dark>
    <v-app-bar-nav-icon @click="drawer = !drawer"/>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list>
      <v-list-item
          class="my-10"
          prepend-avatar="https://randomuser.me/api/portraits/men/9.jpg"
          subtitle="john.doe@mail.com"
          title="John Doe"
      ></v-list-item>
      <v-list-item link href="/">
        <v-list-item-title>
          <v-icon icon="mdi-home" color="#4E3130"></v-icon>
          Inicio
        </v-list-item-title>
      </v-list-item>
      <v-list-item link href="/dishes/list">
        <v-list-item-title>
          <v-icon icon="mdi-food-turkey" color="#4E3130"></v-icon>
          Mis Preparaciones
        </v-list-item-title>
      </v-list-item>
      <v-divider class="my-5"></v-divider>
      <v-list-item link href="/ingredients/list">
        <v-list-item-title>
          <v-icon icon="mdi-chili-mild" color="#4E3130"></v-icon>
          Ingredientes
        </v-list-item-title>
      </v-list-item>

      <v-list-item link href="/ventas">
        <v-list-item-title>
          <v-icon icon="mdi-shopping" color="#4E3130"></v-icon>
          Inventario
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider class="my-5"></v-divider>
    <v-list-item link href="/types/list">
      <v-list-item-title>
        <v-icon icon="mdi-clock" color="#5B6057"></v-icon>
        Tiempos
      </v-list-item-title>
    </v-list-item>
    <v-list-item link href="/meal_groups/list">
      <v-list-item-title>
        <v-icon icon="mdi-food-variant" color="#5B6057"></v-icon>
        Grupos
      </v-list-item-title>
    </v-list-item>
    <v-list-item link href="/measure_units/list">
      <v-list-item-title>
        <v-icon icon="mdi-weight-pound" color="#5B6057"></v-icon>
        Unidades de Medida
      </v-list-item-title>
    </v-list-item>
    <v-spacer/>
    <v-list>
      <v-list-item @click="logout">
        <v-list-item>
          <v-list-item-title>
            <v-icon icon="mdi-logout"></v-icon>
            Cerrar Sesión
          </v-list-item-title>

        </v-list-item>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>