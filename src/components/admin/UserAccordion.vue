<template>
  <div class="accordion-item">
    <div class="accordion-header" @click="toggleAccordion(index)">
      <h3>
        {{ user.username }}
        <i v-if="user.isAdmin" class="fas fa-user-shield admin-icon"></i>
      </h3>
      <span>{{ isActive ? '-' : '+' }}</span>
    </div>
    <div v-if="isActive" class="accordion-content">
      <p><strong>Bruger id:</strong> {{ user.userId }}</p>
      <p><strong>Swipe Niveau:</strong> {{ user.maxSwipeLevel || 'N/A' }}</p>
      <p><strong>Quiz Niveau:</strong> {{ user.maxQuizLevel || 'N/A' }}</p>
      <button @click="resetProgress(user.userId)">Nulstil score</button>
      <button @click="deleteUser(user.userId)">Slet bruger</button>
      <button v-if="!user.isAdmin" @click="grantAdminAccess(user.userId)">Grant Admin</button>
      <button v-if="user.isAdmin" @click="removeAdminAccess(user.userId)">Remove Admin</button>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";

export default {
  name: 'UserAccordion',
  props: {
    user: Object,
    index: Number,
    isActive: Boolean,
    toggleAccordion: Function,
    resetProgress: Function,
    deleteUser: Function
  },
  methods: {
    async checkIfAdmin() {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        return userDoc.exists() && userDoc.data().isAdmin;
      }
      return false;
    },
    async grantAdminAccess(userId) {
      if (await this.checkIfAdmin()) {
        try {
          const userDocRef = doc(db, "users", userId);
          await updateDoc(userDocRef, {
            isAdmin: true
          });
          alert('Admin access granted successfully.');
          this.$emit('updateUser', userId, { isAdmin: true });
        } catch (error) {
          console.error("Error granting admin access:", error);
          alert('Error granting admin access.');
        }
      } else {
        alert('You do not have permission to perform this action.');
      }
    },
    async removeAdminAccess(userId) {
      if (await this.checkIfAdmin()) {
        try {
          const userDocRef = doc(db, "users", userId);
          await updateDoc(userDocRef, {
            isAdmin: false
          });
          alert('Admin access removed successfully.');
          this.$emit('updateUser', userId, { isAdmin: false });
        } catch (error) {
          console.error("Error removing admin access:", error);
          alert('Error removing admin access.');
        }
      } else {
        alert('You do not have permission to perform this action.');
      }
    }
  }
};
</script>

<style scoped>
.accordion-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: var(--main-color);
  color: var(--text-color);
  border-radius: 25px;
  margin-bottom: 10px;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 90%;
  animation: fade-in 0.5s ease-out forwards; /* Fade-in animation */
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  color: var(--text-color);
  width: 100%;
}

.accordion-content {
  padding-bottom: 0.5rem;
  color: var(--text-color);
  justify-content: start;
}

.accordion-content p {
  text-align: left;
}

button {
  padding: 10px 20px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 7px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: var(--secondary-color);
}

.admin-icon {
  margin-left: 10px;
  color: gold;
}
</style>