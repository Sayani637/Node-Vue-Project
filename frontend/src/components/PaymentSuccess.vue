<template>
  <div>
    <p>Payment successful!</p>
  </div>
</template>

<script>
import Toastify from 'toastify-js';
export default {
  name: "PaymentSuccess",
  async mounted() {
    const userId = localStorage.getItem('userId');
    try {
      await fetch(`http://localhost:3000/api/cart/clear/${userId}`, {
        method: 'DELETE'
      });

      Toastify({
        text: 'Payment successful! Cart cleared.',
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        style: {
          background: 'linear-gradient(to right, #00b09b, #96c93d)',
        },
        close: true,
      }).showToast();
    } catch (error) {
      console.error("Cart clear failed:", error);
      Toastify({
        text: 'Payment success, but failed to clear cart.',
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        style: {
          background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
        },
        close: true,
      }).showToast();
    }

    // Redirect to cart after toast
    setTimeout(() => {
      this.$router.push("/cart");
    }, 2500);
  }
};
</script>
