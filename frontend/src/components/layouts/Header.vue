<template>
    <header class="navbar">
        <nav class="nav-container">
            <ul class="nav-links">
                <li><a href="/gallery">Home</a></li>
                <li v-if="isAdmin"><a href="/create-card">Create Card</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>

            <div class="nav-actions">
                <div class="cart-info">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Cart</span>
                    <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
                </div>

                <div class="profile-dropdown" @click="toggleDropdown">
                    <img :src="profileImage" alt="Profile" class="profile-icon" />
                    <div v-if="showDropdown" class="dropdown-menu">
                        <a href="#">Change Profile</a>
                        <a href="#" @click.prevent="logout">Logout</a>
                    </div>
                </div>
            </div>
        </nav>
    </header>
</template>
<script>
import profileImage from '../../assets/images/profileImage.png';

export default {
    name: "Header",
    data() {
        return {
            showDropdown: false,
            profileImage: profileImage,
            userRole: localStorage.getItem('role') || 'user',
            cartCount: 0,
        };
    },
    props: {
        cartCount: {
            type: Number,
            default: 0
        }
    },
    computed: {
        isAdmin() {
            return this.userRole === 'admin';
        }
    },
    methods: {
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
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            this.$router.push('/login');
        }
    }
};
</script>

<style scoped>
.navbar {
    background-color: #000;
    padding: 1rem 0;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 20px;
}

.nav-links {
    list-style: none;
    display: flex;
    gap: 2rem;
    padding: 0;
    margin: 0;
}

.nav-links li a {
    color: white;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1rem;
}

.nav-links li a:hover {
    color: #E0E0E0;
    transition: color 0.3s ease;
}

.nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.profile-dropdown {
    position: relative;
    cursor: pointer;
}

.profile-icon {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

.dropdown-menu {
    position: absolute;
    right: 0;
    top: 40px;
    background-color: white;
    color: #333;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    overflow: hidden;
    min-width: 150px;
    z-index: 1000;
}

.dropdown-menu a {
    display: block;
    padding: 10px 15px;
    text-decoration: none;
    color: #333;
}

.dropdown-menu a:hover {
    background-color: #f0f0f0;
}

.cart-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    margin-right: 20px;
    cursor: pointer;
}

.cart-info i {
    font-size: 1.2rem;
}

.cart-badge {
    background-color: red;
    color: white;
    font-size: 0.75rem;
    border-radius: 50%;
    padding: 2px 6px;
    margin-left: 4px;
    font-weight: bold;
}
</style>