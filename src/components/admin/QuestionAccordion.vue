<template>
  <div class="accordion-item">
    <div class="accordion-header" @click="toggleAccordion(index)">
      <p>Spørgsmål {{ index + 1 }}</p>
      <span>{{ isActive ? '-' : '+' }}</span>
    </div>
    <div v-if="isActive" class="accordion-content">
      <form @submit.prevent="submitUpdate">
        <div class="form-group">
          <label for="questionText">Spørgsmålstekst:</label>
          <input type="text" v-model="localQuestion.questionText" required />
        </div>
        <div v-for="(answer, index) in localQuestion.answers" :key="index" class="answer-section">
          <h4>Svar {{ index + 1 }}</h4>
          <div class="form-group">
            <label :for="'answer' + index">Tekst:</label>
            <input :id="'answer' + index" type="text" v-model="answer.text" required />
          </div>
          <div v-if="showFeedback" class="form-group">
            <label :for="'feedbackHeading' + index">Feedback overskrift:</label>
            <input :id="'feedbackHeading' + index" type="text" v-model="answer.feedbackHeading" required />
          </div>
          <div v-if="showFeedback" class="form-group">
            <label :for="'feedback' + index">Feedback:</label>
            <textarea :id="'feedback' + index" v-model="answer.feedback" rows="2" required></textarea>
          </div>
          <div v-if="showFeedback" class="form-group">
            <label :for="'gifUrl' + index">GIF URL:</label>
            <input :id="'gifUrl' + index" type="text" v-model="answer.gifUrl" />
            <button type="button" @click="openGifModal(index, localQuestion)">Vælg GIF</button>
          </div>
          <div class="form-group checkbox-group">
            <label :for="'isCorrect' + index">Er korrekt:</label>
            <input :id="'isCorrect' + index" type="checkbox" v-model="answer.isCorrect" />
          </div>
        </div>
        <div class="button-group">
          <button type="submit" class="update-button">Opdater spørgsmål</button>
          <button type="button" class="delete-button" @click="deleteQuestion(localQuestion.id)">Slet spørgsmål</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionAccordion',
  props: {
    question: Object,
    index: Number,
    isActive: Boolean,
    showFeedback: Boolean,
    toggleAccordion: Function,
    updateQuestion: Function,
    deleteQuestion: Function,
    openGifModal: Function
  },
  data() {
    return {
      localQuestion: JSON.parse(JSON.stringify(this.question))
    };
  },
  methods: {
    submitUpdate() {
      this.updateQuestion(this.localQuestion);
    }
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
.accordion-item {
  display: flex;
  flex-direction: column;
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

.accordion-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  color: white;
  width: 100%;

}

.accordion-content {
  padding-bottom: 0.5rem;
  color: white;
  justify-content: start;
}

.accordion-content p {
text-align: left;
}

button {
  padding: 10px 20px;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 7px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: var(--secondary-color);
}

</style>