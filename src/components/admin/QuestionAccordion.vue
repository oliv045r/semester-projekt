<template>
  <div class="list-item">
    <div class="list-content">
      <p>Spørgsmål {{ index + 1 }}</p>
    </div>
    <div class="button-group">
      <button type="button" class="icon-button" @click="openEditModal(localQuestion)">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="icon-button" @click="deleteQuestion(localQuestion.id)">
        <i class="fas fa-trash"></i>
      </button>
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
      localQuestion: JSON.parse(JSON.stringify(this.question))
    };
  },
  watch: {
    question: {
      handler(newVal) {
        this.localQuestion = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #0056a6;
  color: white;
  border-radius: 25px;
  margin-bottom: 10px;
  padding: 10px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  width: 90%;
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
  color: white;
  cursor: pointer;
  font-size: 1.2em;
}

.icon-button:hover {
  color: #ccc;
}
</style>