<template>
  <div>
    <Header v-if="showHeader" />
    <router-view />
  </div>
</template>


<script>
import { useRoute } from 'vue-router';
import Header from "./components/layouts/Header.vue";

export default {
  components: {
    Header
  },
  data() {
    return {
      cartCount: 0
    };
  },
  mounted() {
    if (localStorage.getItem('userId')) {
      this.$store.dispatch('fetchCartCount');
    }
  },
  computed: {
    showHeader() {
      const hiddenRoutes = ['/', '/login'];
      return !hiddenRoutes.includes(this.$route.path);
    }
  },
}
</script>

<style>
.page-wrapper {
  padding-top: 80px;
}
</style>