<template>
    <div class="page-content">
        <h1>Create Card</h1>
        <p>This is where you build a new card.</p>

        <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <div class="form-group">
                <label for="title">Title</label>
                <input id="title" v-model="title" type="text" placeholder="Type your Title" />
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" v-model="description" rows="3" placeholder="Enter description..."></textarea>
            </div>

            <div class="form-group">
                <label for="price">Price</label>
                <input id="price" v-model="price" type="number" min="0" step="0.01" placeholder="Enter price" />
            </div>

            <div class="form-group">
                <label for="image">Upload Image</label>
                <input id="image" type="file" @change="previewImage" />
                <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="image-preview" />
            </div>

            <button type="submit" class="submit-btn">Submit</button>
        </form>
    </div>
</template>

<script>
import Toastify from 'toastify-js';
export default {
    name: 'CreateCard',
    data() {
        return {
            title: '',
            description: '',
            price: '',
            imagePreview: null,
        };
    },
    methods: {
        previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                this.imagePreview = URL.createObjectURL(file);
            }
        },
        async handleSubmit() {
            const formData = new FormData();
            formData.append('title', this.title);
            formData.append('description', this.description);
            formData.append('price', this.price);

            const fileInput = document.getElementById('image');
            if (fileInput.files[0]) {
                formData.append('image', fileInput.files[0]);
            }

            try {
                const response = await fetch('http://localhost:3000/api/cards', {
                    method: 'POST',
                    body: formData,
                });
                const result = await response.json();
                Toastify({
                    text: "Card created successfully!",
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    },
                    close: true,
                }).showToast();
                // Reset form fields
                this.title = '';
                this.description = '';
                this.price = '';
                this.imagePreview = null;
                fileInput.value = '';
            } catch (error) {
                console.error('Error submitting card:', error);
                Toastify({
                    text: "Failed to create card",
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
};
</script>

<style scoped>
.page-content {
    max-width: 600px;
    padding: 20px;
    font-family: Arial, sans-serif;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
    margin-bottom: 10px;
}

p {
    margin-bottom: 20px;
    color: #555;
}

.form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin-bottom: 6px;
}

input[type="text"],
input[type="number"],
textarea,
input[type="file"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
}

input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.image-preview {
    margin-top: 10px;
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    background: #eee;
}

.submit-btn {
    padding: 12px 24px;
    background-color: #007bff;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.submit-btn:hover {
    background-color: #0056b3;
}
</style>