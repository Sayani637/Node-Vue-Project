<template>
  <div>
    <p>❌ Payment was cancelled.</p>
  </div>
</template>

<script>
import Toastify from 'toastify-js';
export default {
  name: "PaymentCancel",
  mounted() {
    Toastify({
      text: 'Payment was cancelled.',
      duration: 3000,
      gravity: 'bottom',
      position: 'right',
      style: {
        background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
      },
      close: true,
    }).showToast();

    setTimeout(() => {
      this.$router.push("/cart");
    }, 2500);
  }
};
</script>
