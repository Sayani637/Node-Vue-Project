<template>
  <div>
    <Header v-if="showHeader" :cartCount="cartCount" />
    <div class="page-wrapper">
      <router-view @cart-updated="updateCartCount" />
    </div>
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
  computed: {
    showHeader() {
      const hiddenRoutes = ['/', '/login'];
      return !hiddenRoutes.includes(this.$route.path);
    }
  },
  methods: {
    updateCartCount(newCount) {
      this.cartCount = newCount;
    }
  },
  async fetchCartCount() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/cart/${userId}`);
      const data = await res.json();
      this.cartCount = data.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } catch (err) {
      console.error("Fetch cart count failed:", err);
    }
  },
  async mounted() {
    await this.fetchCartCount();
  }
}
</script>

<style>
.page-wrapper {
  padding-top: 80px;
}
</style>