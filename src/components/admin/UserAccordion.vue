<template>
  <div class="accordion-item">
    <div class="accordion-header" @click="toggleAccordion(index)">
      <h3>{{ user.username }}</h3>
      <span>{{ isActive ? '-' : '+' }}</span>
    </div>
    <div v-if="isActive" class="accordion-content">
      <p><strong>Bruger id:</strong> {{ user.userId }}</p>
      <p><strong>Swipe Niveau:</strong> {{ user.maxSwipeLevel || 'N/A' }}</p>
      <p><strong>Quiz Niveau:</strong> {{ user.maxQuizLevel || 'N/A' }}</p>
      <button @click="confirmResetProgress">Nulstil score</button>
      <button @click="confirmDeleteUser">Slet bruger</button>
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
export default {
  name: 'UserAccordion',
  props: {
    user: Object,
    index: Number,
    isActive: Boolean,
    toggleAccordion: Function,
    resetProgress: Function,
    deleteUser: Function,
  },
  data() {
    return {
      showModal: false, // Modalens synlighed
      modalMessage: '', // Beskeden i modal
      modalAction: null, // Handler til handlingen
    };
  },
  methods: {
    confirmResetProgress() {
      this.showModal = true;
      this.modalMessage = "Er du sikker på, at du vil nulstille brugerens score?";
      this.modalAction = () => this.resetProgress(this.user.userId);
    },
    confirmDeleteUser() {
      this.showModal = true;
      this.modalMessage = "Er du sikker på, at du vil slette brugeren?";
      this.modalAction = () => this.deleteUser(this.user.userId);
    },
    executeAction() {
      if (this.modalAction) {
        this.modalAction(); // Kald den gemte handling
      }
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.modalMessage = '';
      this.modalAction = null;
    },
  },
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
  margin-top: 10px;
  padding: 10px 20px;
  width: 46.5%;
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

/* Modal Styling */
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
  background: var(--background-color);
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
