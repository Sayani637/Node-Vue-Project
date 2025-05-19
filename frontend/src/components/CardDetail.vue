<template>
    <div class="card-detail-container">
        <img :src="getFullImageUrl(card.imageUrl)" alt="Card Image" class="detail-image" />
        <h1>{{ card.title }}</h1>
        <p>{{ card.description }}</p>
        <p class="price">₹{{ card.price }}</p>

        <div class="button-row">
            <button class="buy-now">Buy Now</button>
            <button class="add-to-cart">Add to Cart</button>
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
        }
    }
};
</script>

<style scoped>
.card-detail-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    text-align: center;
    font-family: Arial, sans-serif;
}

.detail-image {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
    margin-bottom: 20px;
}

.price {
    font-weight: bold;
    font-size: 1.4rem;
    color: #2d3748;
    margin: 10px 0;
}

.button-row {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
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
