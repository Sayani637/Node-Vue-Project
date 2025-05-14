<template>
    <div class="reset-wrapper">
        <div class="reset-panel">
            <h2>Reset Your Password</h2>
            <p class="subtitle">Please enter a new password for your account.</p>

            <form @submit.prevent="submitNewPassword">
                <input type="password" v-model="password" placeholder="New Password" required />
                <input type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
                <button type="submit" class="reset-btn">Reset Password</button>
            </form>
        </div>
    </div>
</template>

<script>
import Toastify from 'toastify-js';
import { useRoute, useRouter } from 'vue-router';

export default {
    data() {
        return {
            password: '',
            confirmPassword: '',
        };
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        return { route, router };
    },
    methods: {
        async submitNewPassword() {
            if (this.password !== this.confirmPassword) {
                Toastify({
                    text: "Passwords do not match.",
                    duration: 3000,
                    style: { background: "#ff5f6d" },
                }).showToast();
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/auth/reset-password/${this.route.params.token}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPassword: this.password }),
                });

                const result = await response.json();

                if (response.ok) {
                    Toastify({
                        text: "Password reset successful! You can now login.",
                        duration: 3000,
                        style: { background: "#00b09b" },
                    }).showToast();
                    this.router.push('/login');
                } else {
                    Toastify({
                        text: result.message || "Reset failed.",
                        duration: 3000,
                        style: { background: "#ff5f6d" },
                    }).showToast();
                }
            } catch (err) {
                Toastify({
                    text: "Server error. Try again later.",
                    duration: 3000,
                    style: { background: "#ff5f6d" },
                }).showToast();
            }
        },
    },
};
</script>

<style scoped>
.reset-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fafafa;
}

.reset-panel {
    max-width: 500px;
    width: 100%;
    background: white;
    padding: 40px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
    text-align: center;
    margin-bottom: 10px;
}

.subtitle {
    text-align: center;
    color: #666;
    margin-bottom: 30px;
}

input {
    width: 100%;
    padding: 12px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    outline: none;
}

.reset-btn {
    width: 100%;
    padding: 14px;
    background: #222;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
}
</style>
