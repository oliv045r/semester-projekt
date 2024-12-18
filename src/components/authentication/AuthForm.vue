<template>
   <div class="auth-form">
      <h2>{{ title }}</h2>
      <form @submit.prevent="handleSubmit">
         <div>
            <input
               tabindex="1"
               placeholder="E-mail"
               type="email"
               v-model="email"
               required
               aria-label="E-mail" />
         </div>
         <div>
            <input
               tabindex="2"
               placeholder="Adgangskode"
               type="password"
               v-model="password"
               required
               aria-label="Adgangskode" />
         </div>
         <div v-if="showUsername">
            <input
               tabindex="3"
               placeholder="Brugernavn"
               type="text"
               v-model="username"
               required
               aria-label="Brugernavn" />
         </div>
         <div
            class="stay-logged"
            v-if="showStayLoggedIn">
            <input
               tabindex="4"
               type="checkbox"
               v-model="stayLoggedIn"
               aria-label="Forbliv logget ind" />
            <label> Forbliv logget ind </label>
         </div>
         <button
            tabindex="5"
            class="form-btn"
            type="submit"
            aria-label="Submit form">
            {{ buttonText }}
         </button>
      </form>
   </div>
</template>

<script>
export default {
   name: "AuthForm",
   props: {
      title: {
         type: String,
         required: true,
      },
      buttonText: {
         type: String,
         required: true,
      },
      showStayLoggedIn: {
         type: Boolean,
         default: false,
      },
      showUsername: {
         type: Boolean,
         default: false,
      },
   },
   data() {
      return {
         email: "",
         password: "",
         username: "",
         stayLoggedIn: false,
      };
   },
   methods: {
      handleSubmit() {
         this.$emit("submit", { email: this.email, password: this.password, username: this.username, stayLoggedIn: this.stayLoggedIn });
      },
   },
};
</script>

<style scoped>
.auth-form {
   max-width: 400px;
   min-width: 300px;
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
   background-color: #5d5d5d;
   color: var(--text-color);
   font-weight: normal;
   border: none;
}

.auth-form input::placeholder {
   color: var(--text-color);
   font-weight: normal;
}

.form-btn {
   width: 100%;
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

.stay-logged {
   width: 100%;
   display: flex;
   align-items: start;
   gap: 0.5em;
}
.stay-logged input {
   width: 1rem;
}
.stay-logged label {
   width: 100%;
}

.auth-form button:hover {
   background-color: #0056b3;
}
</style>
