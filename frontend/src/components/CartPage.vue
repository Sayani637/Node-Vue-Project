<template>
  <div class="cart-page">
    <h2>Your Cart</h2>
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Your cart is empty.</p>
    </div>

    <div class="cart-wrapper" v-else>
      <!-- Left: Product Details -->
      <div class="cart-left">
        <div class="cart-item" v-for="item in cartItems" :key="item.cardId._id">
          <img :src="`http://localhost:3000${item.cardId.imageUrl}`" alt="Product" class="product-image" />
          <div class="cart-info">
            <h3>{{ item.cardId.title }}</h3>
            <div class="price-row">
              <span class="original">₹{{ item.cardId.price }}</span>
            </div>
            <p class="delivery">Delivery by Sat May 31 | <span class="free">Free</span></p>
          </div>

          <div class="cart-actions">
            <div class="quantity-control">
              <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1">−</button>
              <input type="text" :value="item.quantity" readonly />
              <button @click="increaseQuantity(item)">+</button>
            </div>
            <button @click="removeItem(item)" class="remove-button">Remove</button>
          </div>
        </div>
      </div>

      <!-- Right: Price Details -->
      <div class="cart-right">
        <h3>PRICE DETAILS</h3>
        <div class="price-detail">
          <div class="row">
            <span>Price ({{ cartItems.length }} item)</span>
            <span>₹{{ totalOriginalPrice }}</span>
          </div>
          <div class="row">
            <span>Delivery Charges</span>
            <span class="green">Free</span>
          </div>
          <hr />
          <div class="row total">
            <strong>Total Amount</strong>
            <strong>₹{{ totalPrice }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "CartPage",
  data() {
    return {
      cartItems: [],
      userId: localStorage.getItem('userId'),
    };
  },
  computed: {
    totalOriginalPrice() {
      return this.cartItems.reduce((sum, item) => sum + (item.cardId.price * item.quantity), 0);
    },
    totalPrice() {
      return this.totalOriginalPrice; // Update if any discount logic exists
    },
  },
  async created() {
    try {
      const response = await axios.get(`http://localhost:3000/api/cart/${this.userId}`);
      this.cartItems = response.data.items.map(item => ({
        ...item,
        quantity: item.quantity || 1
      }));
    } catch (error) {
      console.error("Failed to load cart:", error);
    }
  },
  methods: {
    increaseQuantity(item) {
      item.quantity++;
      this.updateCart(item);
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.updateCart(item);
      }
    },
    updateCart(item) {
      axios.put(`http://localhost:3000/api/cart/update`, {
        userId: this.userId,
        cardId: item.cardId._id,
        quantity: item.quantity
      }).catch(error => {
        console.error("Failed to update cart:", error);
      });
    },
    removeItem(item) {
      axios.delete('http://localhost:3000/api/cart/remove', {
        data: {
          userId: this.userId,
          cardId: item.cardId._id
        }
      })
        .then(() => {
          this.cartItems = this.cartItems.filter(ci => ci.cardId._id !== item.cardId._id);
        })
        .catch(error => {
          console.error("Failed to remove item:", error);
        });
    }
  }
};
</script>

<style scoped>
.cart-page {
  margin-top: 20px;
  padding: 10px;
  background-color: #f1f3f6;
  font-family: 'Roboto', sans-serif;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.cart-page h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}

.empty-cart {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cart-wrapper {
  display: flex;
  gap: 20px;
  padding: 20px 20px;
  background-color: #f1f3f6;
  font-family: 'Roboto', sans-serif;
  width: 100vw;
  box-sizing: border-box;
  flex-wrap: wrap;
}

/* Left: Product Items */
.cart-left {
  flex: 3;
}

.cart-item {
  display: flex;
  background-color: #fff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-right: 20px;
}

.cart-info {
  flex: 1;
}

.cart-info h3 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 6px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
}

.original {
  font-weight: bold;
  font-size: 16px;
}

.delivery {
  font-size: 14px;
  color: #555;
}

.free {
  color: green;
  font-weight: 500;
}

/* Right: Price Summary */
.cart-right {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  height: fit-content;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.cart-right h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.price-detail .row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
}

.price-detail .total {
  font-size: 16px;
  margin-top: 15px;
}

.green {
  color: green;
}

hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 15px 0;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.quantity-control {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quantity-control button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.quantity-control input {
  width: 40px;
  text-align: center;
  border: 1px solid #ccc;
  margin: 0 8px;
  height: 32px;
  font-weight: bold;
}

.remove-button {
  background-color: #fff5f5;
  color: #d32f2f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
}
</style>
