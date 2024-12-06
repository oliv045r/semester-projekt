<template>
  <div class="auth-form">
    <h2>{{ title }}</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <input placeholder="E-mail" type="email" v-model="email" required />
      </div>
      <div>
        <input placeholder="Adgangskode" type="password" v-model="password" required />
      </div>
      <div v-if="showStayLoggedIn">
        <label>
          <input type="checkbox" v-model="stayLoggedIn" />
          Forbliv logget ind
        </label>
      </div>
      <button class="form-btn" type="submit">{{ buttonText }}</button>
    </form>
  </div>
</template>

<script>

export default {
  name: 'AuthForm',
  components: {
    
  },
  props: {
    title: {
      type: String,
      required: true
    },
    buttonText: {
      type: String,
      required: true
    },
    showStayLoggedIn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: '',
      password: '',
      stayLoggedIn: false
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', { email: this.email, password: this.password, stayLoggedIn: this.stayLoggedIn });
    }
  }
};
</script>

<style scoped>
.auth-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 1em;
  border-radius: 4px;
}
.auth-form h2 {
  text-align: center;
}
.auth-form div {
  margin-bottom: 1em;
}
.auth-form label {
  display: block;
  margin-bottom: 0.5em;
}
.auth-form input {
  width: 100%;
  padding: 0.8em;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #5D5D5D;
  color: var(--text-color);
  font-weight: normal;
  border: none;
}

.auth-form input::placeholder {
    color: var(--text-color);
    font-weight: normal;
}

.form-btn {
  width: 80%;
  display: inline-block;
  background-color: var(--secondary-color); /* Blue color */
  color: #fff; /* White text */
  font-size: 16px; /* Adjust as needed */
  font-weight: bold;
  text-align: center;
  padding: 15px 52px;
  border-radius: 4px;
  clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
}

.form-btn:hover {
    background-color: #2c80b4; /* Darker blue on hover */
}


.auth-form button:hover {
  background-color: #0056b3;
}
</style>