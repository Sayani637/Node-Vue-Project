<template>
  <div>
    <Header v-if="showHeader" />
    <div class="page-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import Header from "./components/layouts/Header.vue";

export default {
  components: {
    Header
  },
  computed: {
    showHeader() {
      const hiddenRoutes = ['/', '/login'];
      return !hiddenRoutes.includes(this.$route.path);
    }
  }
}
</script>

<style>
.page-wrapper {
  padding-top: 80px; 
}
</style>