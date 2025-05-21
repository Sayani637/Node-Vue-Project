import { createStore } from "vuex";

export default createStore({
    state: {
        cartCount: 0
    },
    mutations: {
        setCartCount(state, count) {
            state.cartCount = count;
        },
        incrementCartCount(state) {
            state.cartCount++;
        }
    },
    actions: {
        async fetchCartCount({ commit }) {
            const userId = localStorage.getItem('userId');
            if (!userId) return;

            try {
            const res = await fetch(`http://localhost:3000/api/cart/${userId}`);

            if (!res.ok) {
                console.error('Failed to fetch cart:', res.status);
                commit('setCartCount', 0);
                return;
            }

            const cart = await res.json();

            // Check if cart.items exists and is an array
            if (cart && Array.isArray(cart.items)) {
                const totalQuantity = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
                commit('setCartCount', totalQuantity);
            } else {
                console.warn('Cart items missing or not an array');
                commit('setCartCount', 0);
            }
            } catch (error) {
            console.error('Error fetching cart count:', error);
            commit('setCartCount', 0);
            }
        }
    },
    getters: {
        cartCount: state => state.cartCount
    }
});