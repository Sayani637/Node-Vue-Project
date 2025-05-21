<template>
  <div class="cart-page">
    <h2>Your Cart</h2>
    <div v-if="cartItems.length === 0">Your cart is empty.</div>
    <div v-else class="cart-items">
      <div class="cart-item" v-for="item in cartItems" :key="item._id">
        <img :src="item.image" alt="Product Image" class="item-image" />
        <div class="item-details">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <strong>₹{{ item.price }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CartPage',
  data() {
    return {
      cartItems: []
    };
  },
  async created() {
    try {
      const response = await axios.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      this.cartItems = response.data;
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  }
};
</script>

<style scoped>
.cart-page {
  padding: 2rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  background: #f7f7f7;
  padding: 1rem;
  border-radius: 8px;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.item-details {
  flex: 1;
}
</style>
