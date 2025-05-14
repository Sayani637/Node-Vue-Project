<template>
  <div class="container">
    <h1>Card Gallery</h1>
    <div class="cards">
      <div v-for="card in cards" :key="card._id" class="card">
        <span class="edit-icon" @click="editCard(card)" title="Edit Card">✏️</span>
        <span class="delete-icon" @click="deleteCard(card._id)" title="Delete Card">🗑️</span>
        <img :src="getFullImageUrl(card.imageUrl)" alt="Card Image" />
        <h2>{{ card.title }}</h2>
        <p>{{ card.description }}</p>
        <p class="price">₹{{ card.price }}</p>
      </div>
    </div>
  </div>

  <!-- Edit Modal -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <h2>Edit Card</h2>
      <form @submit.prevent="handleUpdate" enctype="multipart/form-data">
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
          <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="image-preview small-preview" />
        </div>

        <button type="submit" class="submit-btn">Update</button>
      </form>
    </div>
  </div>

</template>

<script>
import Toastify from 'toastify-js';
export default {
  name: "CardGallery",
  data() {
    return {
      cards: [],
      showModal: false,
      title: '',
      description: '',
      imagePreview: null,
      selectedCardId: null,
    };
  },
  mounted() {
    this.fetchCards();
  },
  methods: {
    getFullImageUrl(relativePath) {
      return `http://localhost:3000${relativePath}`;
    },
    async fetchCards() {
      try {
        const res = await fetch('http://localhost:3000/api/cards');
        this.cards = await res.json();
      } catch (err) {
        console.error("Error fetching cards:", err);
      }
    },
    editCard(card) {
      this.selectedCardId = card._id;
      this.title = card.title;
      this.description = card.description;
      this.price = card.price;
      this.imagePreview = this.getFullImageUrl(card.imageUrl);
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.title = '';
      this.description = '';
      this.price = '';
      this.imagePreview = null;
      this.selectedCardId = null;
    },
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    async handleUpdate() {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('description', this.description);
      formData.append('price', this.price);
      const fileInput = document.getElementById('image');
      if (fileInput.files[0]) {
        formData.append('image', fileInput.files[0]);
      }

      try {
        const res = await fetch(`http://localhost:3000/api/cards/${this.selectedCardId}`, {
          method: 'PUT',
          body: formData,
        });

        this.fetchCards();
        this.closeModal();
        Toastify({
          text: "Card updated successfully!",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          close: true,
        }).showToast();
      } catch (err) {
        console.error("Error updating card:", err);
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
    async deleteCard(cardId) {
      if (!confirm('Are you sure you want to delete this card?')) return;

      try {
        await fetch(`http://localhost:3000/api/cards/${cardId}`, {
          method: 'DELETE',
        });

        this.fetchCards();
        Toastify({
          text: "Card deleted successfully!",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "linear-gradient(to right, #ff416c, #ff4b2b)",
          },
          close: true,
        }).showToast();
      } catch (err) {
        console.error("Error deleting card:", err);
        Toastify({
          text: "Failed to delete card",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
          close: true,
        }).showToast();
      }
    }
  }
};
</script>


<style scoped>
.container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.card {
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  transition: transform 0.3s;
  position: relative;
}

.edit-icon {
  position: absolute;
  top: 10px;
  right: 46px;
  cursor: pointer;
  font-size: 20px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: transform 0.2s ease;
}

.edit-icon:hover {
  transform: scale(1.1);
}

.delete-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: transform 0.2s ease;
}

.delete-icon:hover {
  transform: scale(1.1);
}

.card:hover {
  transform: translateY(-5px);
}

.card img {
  width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 300px;
}

.card h2 {
  margin: 10px;
  font-size: 1.2rem;
}

.card p {
  margin: 10px;
  color: #555;
}

.price {
  margin: 10px;
  font-weight: bold;
  color: #2d3748;
  font-size: 1.1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.small-preview {
  width: 100px;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

.submit-btn {
  padding: 12px 24px;
  background-color: #38a169;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #276749;
}
</style>
