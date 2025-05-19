<template>
  <div class="contact-page">
    <section class="contact-header">
      <div>
        <p class="subtitle">Contact Us</p>
        <h2>Grow Your Business With <br /><span class="highlight">Our Expertise</span></h2>
      </div>
      <p class="description">
        If you are looking for high-quality web designing and development, software development and mobile application
        development, contact us.
        We have a team of experts who specialize in IT solutions.
      </p>
    </section>

    <section class="contact-section">
      <div class="contact-info">
        <h3>Contact Information</h3>

        <div class="location">
          <h4>Indian Location</h4>
          <p>90, Kasundia Road, Howrah, Pin No.-711101</p>
          <p><strong>Email:</strong> sayani@gmail.com</p>
          <p><strong>Phone:</strong> +91 8697409432</p>
        </div>

        <div class="social-links">
          <a href="#"><i class="fab fa-linkedin"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
        </div>
      </div>

      <div class="contact-form">
        <h3>Send a Message</h3>
        <form @submit.prevent="submitForm">
          <input type="text" placeholder="Name" v-model="name" />
          <input type="email" placeholder="Email Address" v-model="email" />
          <input type="tel" placeholder="Mobile No." v-model="mobile" />
          <select v-model="subject">
            <option disabled value="">Select Option</option>
            <option>General Inquiry</option>
            <option>Support</option>
            <option>Project Quote</option>
          </select>
          <textarea rows="3" placeholder="Write your message here..." v-model="message"></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>

    <section class="map-section">
      <div class="container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d29472.417365613735!2d88.31303680000003!3d22.57715200000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1746178756687!5m2!1sen!2sin"
          width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import Toastify from 'toastify-js';

export default {
  name: 'ContactPage',
  data() {
    return {
      name: '',
      email: '',
      mobile: '',
      subject: '',
      message: '',
    };
  },
  methods: {
    async submitForm() {
      try {
        const payload = {
          name: this.name,
          email: this.email,
          mobile: this.mobile,
          subject: this.subject,
          message: this.message,
        };

        const response = await axios.post('http://localhost:3000/api/contact/send-email', payload);

        if (response.status === 200) {
          Toastify({
            text: "Message sent successfully!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            close: true,
          }).showToast();
          // Clear form
          this.name = '';
          this.email = '';
          this.mobile = '';
          this.subject = '';
          this.message = '';
        }
      } catch (err) {
        Toastify({
          text: "Error sending message. Please try again later.",
          duration: 3000,
          gravity: "bottom",
          position: "right",
          style: {
            background: "linear-gradient(to right, #ff5f6d, #ffc371)",
          },
          close: true,
        }).showToast();
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
.contact-page {
  font-family: 'Arial', sans-serif;
  color: #333;
}

.contact-header {
  padding: 40px 20px;
  text-align: center;
  background-color: #fff;
}

.subtitle {
  color: #007bff;
  font-weight: bold;
  margin-bottom: 8px;
}

h2 {
  font-size: 2rem;
  line-height: 1.4;
}

.highlight {
  color: #003366;
}

.description {
  margin-top: 20px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.contact-section {
  display: flex;
  flex-wrap: wrap;
  background-color: #0c5858;
  color: white;
  padding: 40px 20px;
  gap: 40px;
  justify-content: center;
}

.contact-info,
.contact-form {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
  background-color: #065050;
  padding: 20px;
  border-radius: 10px;
}

.contact-info h3,
.contact-form h3 {
  margin-bottom: 20px;
}

.location {
  margin-bottom: 20px;
}

.social-links a {
  margin-right: 10px;
  color: white;
  font-size: 20px;
}

.contact-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-form input,
.contact-form textarea,
.contact-form select {
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
}

.contact-form button {
  background-color: #007bff;
  border: none;
  padding: 12px;
  color: white;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.contact-form button:hover {
  background-color: #0056b3;
}

.map-section {
  width: 1200px;
  margin-top: 0;
}
</style>
