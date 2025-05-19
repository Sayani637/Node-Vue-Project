<template>
    <div class="card-detail-container">
        <div class="card-content">
            <img :src="getFullImageUrl(card.imageUrl)" alt="Card Image" class="detail-image" />

            <div class="card-info">
                <h1>{{ card.title }}</h1>
                <p>{{ card.description }}</p>
                <p class="price">₹{{ card.price }}</p>

                <div class="button-row">
                    <button class="add-to-cart" @click="addToCart"><i class="fas fa-shopping-cart"></i> Add to
                        Cart</button>
                    <button class="buy-now"><i class="fas fa-bolt"></i> Buy Now</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'CardDetail',
    data() {
        return {
            card: {}
        };
    },
    async mounted() {
        const cardId = this.$route.params.id;
        try {
            const res = await fetch(`http://localhost:3000/api/cards/${cardId}`);
            this.card = await res.json();
        } catch (err) {
            console.error("Failed to fetch card detail:", err);
        }
    },
    methods: {
        getFullImageUrl(relativePath) {
            return `http://localhost:3000${relativePath}`;
        },
        async addToCart() {
            const userId = localStorage.getItem('userId');
            console.log("User ID:", userId); 

            if (!userId) {
                alert('Please login first');
                return;
            }

            try {
                const res = await fetch('http://localhost:3000/api/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, cardId: this.card._id })
                });
                const data = await res.json();
                this.$emit('cart-updated', data.cartCount); // fixed: use data.cartCount instead of data.cart.length
            } catch (err) {
                console.error("Add to cart failed:", err);
            }
        },
    }
};
</script>

<style scoped>
.card-detail-container {
    max-width: 1000px;
    margin: 40px auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.card-content {
    display: flex;
    gap: 40px;
    align-items: flex-start;
}

.detail-image {
    width: 50%;
    max-height: 400px;
    object-fit: contain;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.card-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.card-info h1 {
    font-size: 2rem;
    margin-bottom: 10px;
}

.card-info p {
    margin-bottom: 12px;
    font-size: 1.1rem;
}

.price {
    font-weight: bold;
    font-size: 1.4rem;
    color: #2d3748;
}

.button-row {
    display: flex;
    gap: 20px;
    margin-top: 20px;
}

.buy-now,
.add-to-cart {
    padding: 12px 28px;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
}

.buy-now {
    background-color: #3182ce;
    color: white;
}

.add-to-cart {
    background-color: #f6ad55;
    color: white;
}

.buy-now:hover {
    background-color: #2b6cb0;
}

.add-to-cart:hover {
    background-color: #dd6b20;
}
</style>
