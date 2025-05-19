<template>
    <div class="auth-wrapper">
        <div class="auth-panel">
            <h2>
                {{ showForgotForm ? 'Forgot Password' : showOtpInput ? 'Verify OTP' : 'Login' }}
            </h2>
            <p class="subtitle">
                {{ showForgotForm
                    ? 'Enter your email to receive a reset link.'
                    : showOtpInput
                        ? 'Enter the 6-digit code sent to your email.'
                        : 'Enter your email and password to log in.'
                }}
            </p>

            <!-- Login Form -->
            <form v-if="!showOtpInput && !showForgotForm" @submit.prevent="handleLogin">
                <input type="email" v-model="loginEmail" placeholder="Email" required />
                <div class="password-row">
                    <input type="password" v-model="loginPassword" placeholder="Password" required />
                    <a href="#" class="forgot" @click.prevent="showForgotForm = true">Forgot password?</a>
                </div>
                <button type="submit" class="auth-btn">LOGIN</button>
                <p class="toggle-link">
                    Don't have an account? <router-link to="/">Sign Up</router-link>
                </p>
                <div class="divider">Sign In with</div>
                <div class="social-icons">
                    <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" />
                    <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" />
                    <img src="https://cdn-icons-png.flaticon.com/512/300/300221.png" alt="Google" />
                </div>
            </form>

            <!-- OTP Verification -->
            <form v-else-if="showOtpInput" @submit.prevent="verifyOtp">
                <input type="text" v-model="otp" placeholder="Enter OTP" required />
                <button type="submit" class="auth-btn">Verify OTP</button>
                <p class="toggle-link">
                    <span @click="showOtpInput = false">Back to Login</span>
                </p>
            </form>

            <!-- Forgot Password -->
            <div v-else-if="showForgotForm">
                <input type="email" v-model="forgotEmail" placeholder="Enter your email" required />
                <button @click="sendForgotPassword" class="auth-btn">Send Reset Link</button>
                <p class="toggle-link">
                    <span @click="showForgotForm = false">Back to Login</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import Toastify from 'toastify-js';

export default {
    data() {
        return {
            loginEmail: '',
            loginPassword: '',
            showOtpInput: false,
            otp: '',
            emailForOtp: '',
            forgotEmail: '',
            showForgotForm: false,
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: this.loginEmail,
                        password: this.loginPassword,
                    }),
                });

                const result = await response.json();
                if (response.ok && result.step === 'otp') {
                    localStorage.setItem('role', result.role);
                    Toastify({
                        text: 'OTP sent to email.',
                        duration: 3000,
                        gravity: 'bottom',
                        position: 'right',
                        style: {
                            background: 'linear-gradient(to right, #00b09b, #96c93d)',
                        },
                        close: true,
                    }).showToast();

                    this.emailForOtp = this.loginEmail;
                    this.showOtpInput = true;
                } else {
                    Toastify({
                        text: result.message || 'Login failed.',
                        duration: 3000,
                        gravity: 'bottom',
                        position: 'right',
                        style: {
                            background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
                        },
                        close: true,
                    }).showToast();
                }
            } catch (error) {
                Toastify({
                    text: 'Server error. Please try again.',
                    duration: 3000,
                    gravity: 'bottom',
                    position: 'right',
                    style: {
                        background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
                    },
                    close: true,
                }).showToast();
            }
        },

        async verifyOtp() {
            try {
                const response = await fetch('http://localhost:3000/api/auth/verify-otp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.emailForOtp, otp: this.otp }),
                });
                const result = await response.json();

                if (response.ok) {
                    Toastify({
                        text: 'Login successful!',
                        duration: 3000,
                        gravity: 'bottom',
                        position: 'right',
                        style: {
                            background: 'linear-gradient(to right, #00b09b, #96c93d)',
                        },
                        close: true,
                    }).showToast();

                    localStorage.setItem('auth', true);
                    this.$router.push('/gallery');
                } else {
                    Toastify({
                        text: result.message || 'OTP invalid.',
                        duration: 3000,
                        gravity: 'bottom',
                        position: 'right',
                        style: {
                            background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
                        },
                        close: true,
                    }).showToast();
                }
            } catch (err) {
                Toastify({
                    text: 'OTP verification failed',
                    duration: 3000,
                    gravity: 'bottom',
                    position: 'right',
                    style: {
                        background: 'linear-gradient(to right, #ff5f6d, #ffc371)',
                    },
                    close: true,
                }).showToast();
            }
        },

        async sendForgotPassword() {
            try {
                const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: this.forgotEmail }),
                });

                const result = await response.json();
                Toastify({
                    text: result.message,
                    duration: 3000,
                    gravity: 'bottom',
                    position: 'right',
                    style: { background: '#00b09b' },
                    close: true,
                }).showToast();

                this.showForgotForm = false;
            } catch (err) {
                Toastify({
                    text: 'Error sending reset email',
                    duration: 3000,
                    gravity: 'bottom',
                    position: 'right',
                    style: { background: '#ff5f6d' },
                    close: true,
                }).showToast();
            }
        },
    },
};
</script>

<style scoped>
.auth-wrapper {
    width: 100%;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
}

.auth-panel {
    width: 100%;
    max-width: 700px;
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

.divider {
    text-align: center;
    margin: 20px 0 10px;
    color: #888;
}

.social-icons {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.social-icons img {
    width: 32px;
    height: 32px;
    cursor: pointer;
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
