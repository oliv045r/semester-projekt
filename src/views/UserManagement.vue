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
        @confirmResetProgress="confirmResetProgress"
        @confirmDeleteUser="confirmDeleteUser"
      />
    </div>
    <div v-else>
      <p>No users found.</p>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <div class="modal-buttons">
          <button @click="executeAction">Ja</button>
          <button @click="closeModal">Annuller</button>
        </div>
      </div>
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
      showModal: false, // For at vise modal
      modalMessage: '', // Modal-besked
      modalAction: null, // Funktion til at udføre handling
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
        const progressRef = collection(db, `users/${userId}/progress`);
        const progressSnapshot = await getDocs(progressRef);
        const batch = writeBatch(db);
        progressSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        const userDocRef = doc(db, `users/${userId}`);
        await updateDoc(userDocRef, {
          maxSwipeLevel: deleteField(),
          maxQuizLevel: deleteField()
        });

        alert('Brugerens score blev nulstillet.');
        this.fetchUsers();
      } catch (error) {
        console.error("Error resetting user progress:", error);
      }
    },
    async deleteUser(userId) {
      try {
        await deleteDoc(doc(db, `users/${userId}`));
        alert('Bruger blev slettet.');
        this.fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    },
    confirmResetProgress(userId) {
      this.showModal = true;
      this.modalMessage = "Er du sikker på, at du vil nulstille brugerens score?";
      this.modalAction = () => this.resetProgress(userId);
    },
    confirmDeleteUser(userId) {
      this.showModal = true;
      this.modalMessage = "Er du sikker på, at du vil slette brugeren?";
      this.modalAction = () => this.deleteUser(userId);
    },
    executeAction() {
      if (this.modalAction) {
        this.modalAction(); // Udfør den gemte handling
      }
      this.closeModal();
    },
    closeModal() {
      this.showModal = false; // Skjul modal
      this.modalAction = null; // Nulstil handling
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 300px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background-color: #f44336;
  color: white;
}

.modal-buttons button:last-child {
  background-color: #ccc;
  color: black;
}
</style>
