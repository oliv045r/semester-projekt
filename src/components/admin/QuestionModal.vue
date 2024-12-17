<template>
  <div class="modal" v-if="isVisible">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h3>{{ modalTitle }}</h3>
      <form @submit.prevent="submitQuestion">
        <div class="form-group">
          <label for="questionText">Spørgsmålstekst:</label>
          <input type="text" id="questionText" v-model="localQuestion.questionText" required />
        </div>
        <div v-for="(answer, index) in localQuestion.answers" :key="index" class="answer-section">
          <div class="accordion-header" @click="toggleAnswer(index)">
            <h4>Svar {{ index + 1 }}</h4>
            <span>{{ activeAnswerIndex === index ? '-' : '+' }}</span>
          </div>
          <div v-if="activeAnswerIndex === index" class="accordion-content">
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
              <button type="button" @click="openGifModal(index)">Vælg GIF</button>
            </div>
            <div class="form-group checkbox-group">
              <label :for="'isCorrect' + index">Er korrekt:</label>
              <input :id="'isCorrect' + index" type="checkbox" v-model="answer.isCorrect" />
            </div>
          </div>
        </div>
        <button type="submit" class="add-button">Tilføj Spørgsmål</button>
      </form>
      <GifModal :isVisible="gifModalVisible" @close="closeGifModal" @select="selectGif" />
    </div>
  </div>
</template>

<script>
import GifModal from '@/components/elements/GifModal.vue';

export default {
  name: 'QuestionModal',
  components: { GifModal },
  props: {
    isVisible: Boolean,
    modalTitle: String,
    showFeedback: Boolean,
    addQuestion: Function,
    closeModal: Function,
    question: Object
  },
  data() {
    return {
      localQuestion: this.getInitialQuestionData(),
      activeAnswerIndex: null,
      gifModalVisible: false,
      gifModalIndex: null
    };
  },
  methods: {
    toggleAnswer(index) {
      this.activeAnswerIndex = this.activeAnswerIndex === index ? null : index;
    },
    getInitialQuestionData() {
      return this.question
        ? JSON.parse(JSON.stringify(this.question))
        : {
            questionText: '',
            answers: this.showFeedback
              ? [
                  { text: '', gifUrl: '', feedbackHeading: '', feedback: '', isCorrect: false },
                  { text: '', gifUrl: '', feedbackHeading: '', feedback: '', isCorrect: false }
                ]
              : [
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false },
                  { text: '', isCorrect: false }
                ]
          };
    },
    submitQuestion() {
      if (this.question) {
        this.updateQuestion(this.localQuestion);
      } else {
        this.addQuestion(this.localQuestion);
      }
      this.closeModal();
    },
    openGifModal(index) {
      this.gifModalIndex = index;
      this.gifModalVisible = true;
    },
    closeGifModal() {
      this.gifModalVisible = false;
    },
    selectGif(url) {
      if (this.gifModalIndex !== null) {
        this.localQuestion.answers[this.gifModalIndex].gifUrl = url;
      }
      this.gifModalVisible = false;
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        this.localQuestion = this.getInitialQuestionData();
      } else {
        this.localQuestion = this.getInitialQuestionData();
      }
    }
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #323232;
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group label {
  margin-right: 10px;
}

.add-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #0056b3;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  background-color: #444;
  color: #fff;
  border-radius: 5px;
  margin-bottom: 5px;
}

.accordion-content {
  padding: 10px;
  background-color: #555;
  border-radius: 5px;
}
</style>