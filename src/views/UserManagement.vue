<template>
  <div class="admin-container">
    <h2>Administrer brugere</h2>
    <div class="user-container" v-if="users.length > 0">
      <UserAccordion
        v-for="(user, index) in users"
        :key="user.userId"
        :user="user"
        :index="index"
        :isActive="activeIndex === index"
        :toggleAccordion="toggleAccordion"
        :resetProgress="resetProgress"
        :deleteUser="deleteUser"
      />
    </div>
    <div v-else>
      <p>No users found.</p>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc, updateDoc, deleteField, writeBatch } from "firebase/firestore";
import UserAccordion from "@/components/admin/UserAccordion.vue";

export default {
  name: 'UserManagement',
  components: {
    UserAccordion
  },
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
  width: 90%;
}

.admin-container h2 {
  margin-bottom: 20px;
}

.user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 33.8rem;
  overflow-x: hidden;
}

</style>