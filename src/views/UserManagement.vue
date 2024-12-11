<template>
  <div class="admin-container">
    <h2>User Management</h2>
    <div v-if="users.length > 0">
      <div v-for="(user, index) in users" :key="user.userId" class="accordion-item">
        <div class="accordion-header" @click="toggleAccordion(index)">
          <h3>{{ user.username }}</h3>
          <span>{{ activeIndex === index ? '-' : '+' }}</span>
        </div>
        <div v-if="activeIndex === index" class="accordion-content">
          <p><strong>User ID:</strong> {{ user.userId }}</p>
          <p><strong>Swipe Level:</strong> {{ user.maxSwipeLevel || 'N/A' }}</p>
          <p><strong>Quiz Level:</strong> {{ user.maxQuizLevel || 'N/A' }}</p>
          <button @click="resetProgress(user.userId)">Reset Progress</button>
          <button @click="deleteUser(user.userId)">Delete User</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No users found.</p>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc, updateDoc, deleteField, writeBatch } from "firebase/firestore";

export default {
  name: 'UserManagement',
  data() {
    return {
      users: [],
      activeIndex: null,
    };
  },
  async created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        this.users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    async resetProgress(userId) {
      try {
        // Delete the progress subcollection
        const progressRef = collection(db, `users/${userId}/progress`);
        const progressSnapshot = await getDocs(progressRef);
        const batch = writeBatch(db);
        progressSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        // Remove SwipeLevel and QuizLevel fields
        const userDocRef = doc(db, `users/${userId}`);
        await updateDoc(userDocRef, {
          maxSwipeLevel: deleteField(),
          maxQuizLevel: deleteField()
        });

        alert('User progress reset successfully.');
        this.fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error("Error resetting user progress:", error);
      }
    },
    async deleteUser(userId) {
      try {
        // Delete the user document
        await deleteDoc(doc(db, `users/${userId}`));
        alert('User deleted successfully.');
        this.fetchUsers(); // Refresh the user list
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    }
  }
};
</script>

<style scoped>
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.accordion-item {
  width: 100%;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  background-color: #323232;
  color: white;
}

.accordion-content {
  padding: 1rem;
  background-color: #444;
  color: white;
}

button {
  padding: 10px 20px;
  background-color: var(--main-color);
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
}

button:hover {
  background-color: var(--secondary-color);
}
</style>