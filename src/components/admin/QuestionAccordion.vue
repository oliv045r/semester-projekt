<template>
  <div class="list-item">
    <div class="list-content">
      <p>Spørgsmål {{ index + 1 }}</p>
    </div>
    <div class="button-group">
      <button type="button" class="icon-button" @click="openEditModal(localQuestion)">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="icon-button" @click="showConfirmModal = true">
        <i class="fas fa-trash"></i>
      </button>
    </div>

    <!-- Modal til sletning -->
    <div v-if="showConfirmModal" class="modal-overlay">
      <div class="modal-content">
        <p>Er du sikker på, du vil slette spørgsmålet?</p>
        <div class="modal-buttons">
          <button @click="confirmDelete">Ja</button>
          <button @click="closeModal">Annuller</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionAccordion',
  props: {
    question: Object,
    index: Number,
    deleteQuestion: Function,
    openEditModal: Function
  },
  data() {
    return {
      localQuestion: JSON.parse(JSON.stringify(this.question)),
      showConfirmModal: false // Modal-tilstand
    };
  },
  watch: {
    question: {
      handler(newVal) {
        this.localQuestion = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    }
  },
  methods: {
    confirmDelete() {
      this.deleteQuestion(this.localQuestion.id);
      this.showConfirmModal = false; // Luk modal efter sletning
    },
    closeModal() {
      this.showConfirmModal = false; // Luk modal uden sletning
    }
  }
};
</script>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--main-color);
  color: var(--text-color);
  border-radius: 25px;
  margin-bottom: 10px;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 87%;
  animation: fade-in 0.5s ease-out forwards; /* Fade-in animation */
}

.list-content {
  flex-grow: 1;
  text-align: left;
}

.button-group {
  display: flex;
  gap: 10px;
}

.icon-button {
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 1.2em;
}

.icon-button:hover {
  color: var(--text-color);
}

/* Modal styling */
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
