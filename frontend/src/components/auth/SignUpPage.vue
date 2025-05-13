<template>
  <div class="auth-wrapper">
    <!-- Sign Up Section -->
    <div class="auth-panel">
      <h2>Sign Up</h2>
      <p class="subtitle">First create your account</p>
      <form @submit.prevent="handleSignUp">
        <input type="text" v-model="fullname" placeholder="Full name" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit" class="auth-btn">SIGN UP</button>
        <p class="toggle-link">
          Already have an account? <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Toastify from 'toastify-js';

export default {
  name: 'SignupPage',

  data() {
    return {
      fullname: '',
      email: '',
      password: '',
    };
  },

  methods: {
    async handleSignUp() {
      try {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullname: this.fullname,
            email: this.email,
            password: this.password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          Toastify({
            text: "Signup successful! Please check your email to verify your account.",
            duration: 4000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            close: true,
          }).showToast();
        } else {
          Toastify({
            text: result.message || "Signup failed.",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            },
            close: true,
          }).showToast();
        }
      } catch (error) {
        console.error('Server error:', error);
        Toastify({
          text: "Failed to sign up",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
          close: true,
        }).showToast();
      }
    },
  },

  setup() {
    const router = useRouter(); 
    return { router };
  }
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
}

.auth-panel {
  width: 50%;
  padding: 60px 40px;
  background: white;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h2 {
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: #999;
  margin-bottom: 30px;
}

input {
  padding: 12px;
  margin-bottom: 15px;
  border: none;
  border-bottom: 1px solid #ccc;
  width: 100%;
  outline: none;
}

.password-row {
  position: relative;
}

.forgot {
  position: absolute;
  right: 0;
  top: 14px;
  font-size: 12px;
  color: #f27234;
  text-decoration: none;
}

.auth-btn {
  background: #222;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
}

.toggle-link {
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

.toggle-link span {
  color: #f27234;
  cursor: pointer;
  text-decoration: underline;
}

.auth-wrapper.reversed .auth-panel:first-child {
  display: none;
}

.auth-wrapper.reversed .auth-panel:last-child {
  display: flex;
}

@media (max-width: 768px) {
  .auth-wrapper {
    flex-direction: column;
  }

  .auth-panel {
    width: 100%;
    padding: 30px 20px;
  }
}
</style>