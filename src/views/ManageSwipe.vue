<template>
  <div class="admin-container">
    <h2>Administrer Swipe spørgsmål</h2>
    <div class="level-selector">
      <label for="level">Vælg level:</label>
      <select v-model="selectedLevel" @change="fetchQuestions" required>
        <option value="1">Level 1</option>
        <option value="2">Level 2</option>
        <option value="3">Level 3</option>
        <option value="4">Level 4</option>
        <option value="5">Level 5</option>
      </select>
    </div>
    <button @click="showAddForm = !showAddForm" class="add-button">
      {{ showAddForm ? 'Cancel' : 'Add Swipe Question' }}
    </button>
    <div v-if="showAddForm" class="add-question-container">
      <h3>Tilføj Swipe spørgsmål</h3>
      <form @submit.prevent="addQuestion">
        <div class="form-group">
          <label for="questionText">Spørgsmålstekst:</label>
          <input type="text" id="questionText" v-model="newQuestion.questionText" required />
        </div>
        <div class="answer-section">
          <h4>Svar 1</h4>
          <div class="form-group">
            <label for="answer1">Tekst:</label>
            <input type="text" id="answer1" v-model="newQuestion.answers[0].text" required />
          </div>
          <div class="form-group">
            <label for="feedbackHeading1">Feedback overskrift:</label>
            <input
              type="text"
              id="feedbackHeading1"
              v-model="newQuestion.answers[0].feedbackHeading"
              required
            />
          </div>
          <div class="form-group">
            <label for="feedback1">Feedback:</label>
            <textarea id="feedback1" v-model="newQuestion.answers[0].feedback" rows="2" required></textarea>
          </div>
          <div class="form-group checkbox-group">
            <label for="isCorrect1">Er korrekt:</label>
            <input type="checkbox" id="isCorrect1" v-model="newQuestion.answers[0].isCorrect" />
          </div>
        </div>
        <div class="answer-section">
          <h4>Svar 2</h4>
          <div class="form-group">
            <label for="answer2">Tekst:</label>
            <input type="text" id="answer2" v-model="newQuestion.answers[1].text" required />
          </div>
          <div class="form-group">
            <label for="feedbackHeading2">Feedback overskrift:</label>
            <input
              type="text"
              id="feedbackHeading2"
              v-model="newQuestion.answers[1].feedbackHeading"
              required
            />
          </div>
          <div class="form-group">
            <label for="feedback2">Feedback:</label>
            <textarea id="feedback2" v-model="newQuestion.answers[1].feedback" rows="2" required></textarea>
          </div>
          <div class="form-group checkbox-group">
            <label for="isCorrect2">Er korrekt:</label>
            <input type="checkbox" id="isCorrect2" v-model="newQuestion.answers[1].isCorrect" />
          </div>
        </div>
        <button type="submit" class="add-button">Add Question</button>
      </form>
    </div>
    <div v-else>
      <h3>Spørgsmål til level {{ selectedLevel }}</h3>
      <div v-if="questions.length > 0">
        <div
          v-for="(question, index) in questions"
          :key="question.id"
          class="accordion-item"
        >
          <div class="accordion-header" @click="toggleAccordion(index)">
            <h3>{{ question.questionText }}</h3>
            <span>{{ activeIndex === index ? '-' : '+' }}</span>
          </div>
          <div v-if="activeIndex === index" class="accordion-content">
            <form @submit.prevent="updateQuestion(question.id)">
              <div class="form-group">
                <label for="questionText">Spørgsmålstekst:</label>
                <input type="text" v-model="question.questionText" required />
              </div>
              <div class="answer-section">
                <h4>Svar 1</h4>
                <div class="form-group">
                  <label for="answer1">Tekst:</label>
                  <input type="text" v-model="question.answers[0].text" required />
                </div>
                <div class="form-group">
                  <label for="feedbackHeading1">Feedback overskrift:</label>
                  <input
                    type="text"
                    v-model="question.answers[0].feedbackHeading"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="feedback1">Feedback:</label>
                  <textarea
                    v-model="question.answers[0].feedback"
                    rows="2"
                    required
                  ></textarea>
                </div>
                <div class="form-group checkbox-group">
                  <label for="isCorrect1">Er korrekt:</label>
                  <input type="checkbox" v-model="question.answers[0].isCorrect" />
                </div>
              </div>
              <div class="answer-section">
                <h4>Svar 2</h4>
                <div class="form-group">
                  <label for="answer2">Tekst:</label>
                  <input type="text" v-model="question.answers[1].text" required />
                </div>
                <div class="form-group">
                  <label for="feedbackHeading2">Feedback overskrift:</label>
                  <input
                    type="text"
                    v-model="question.answers[1].feedbackHeading"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="feedback2">Feedback:</label>
                  <textarea
                    v-model="question.answers[1].feedback"
                    rows="2"
                    required
                  ></textarea>
                </div>
                <div class="form-group checkbox-group">
                  <label for="isCorrect2">Er korrekt:</label>
                  <input type="checkbox" v-model="question.answers[1].isCorrect" />
                </div>
              </div>
              <div class="button-group">
                <button type="submit" class="update-button">Opdater spørgsmål</button>
                <button
                  type="button"
                  class="delete-button"
                  @click="deleteQuestion(question.id)"
                >
                  Slet spørgsmål
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Ingen spørgsmål fundet til dette level</p>
      </div>
    </div>
  </div>
</template>


<script>
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export default {
  name: 'AddSwipe',
  data() {
    return {
      selectedLevel: 1,
      showAddForm: false,
      questions: [],
      activeIndex: null,
      newQuestion: {
        questionText: '',
        answers: [
          { text: '', feedbackHeading: '', feedback: '', isCorrect: false },
          { text: '', feedbackHeading: '', feedback: '', isCorrect: false }
        ]
      }
    };
  },
  methods: {
    async fetchQuestions() {
      try {
        const q = query(collection(db, "SwipeQuestions"), where("SwipeLevel", "==", this.selectedLevel.toString()));
        const querySnapshot = await getDocs(q);
        this.questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
    async addQuestion() {
      try {
        const questionId = `q${Date.now()}`;
        await setDoc(doc(db, "SwipeQuestions", questionId), {
          questionId,
          SwipeLevel: this.selectedLevel.toString(),
          ...this.newQuestion
        });
        this.fetchQuestions();
        this.resetForm();
        this.showAddForm = false;
      } catch (error) {
        console.error("Error adding question:", error);
      }
    },
    async updateQuestion(questionId) {
      try {
        const question = this.questions.find(q => q.id === questionId);
        await updateDoc(doc(db, "SwipeQuestions", questionId), question);
        this.fetchQuestions();
      } catch (error) {
        console.error("Error updating question:", error);
      }
    },
    async deleteQuestion(questionId) {
      try {
        await deleteDoc(doc(db, "SwipeQuestions", questionId));
        this.fetchQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    },
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
    resetForm() {
      this.newQuestion = {
        questionText: '',
        answers: [
          { text: '', feedbackHeading: '', feedback: '', isCorrect: false },
          { text: '', feedbackHeading: '', feedback: '', isCorrect: false }
        ]
      };
    }
  },
  async created() {
    this.fetchQuestions();
  }
};
</script>

<style scoped>
/* General Styles */
:root {
  --main-color: #2D8BD9; /* Primary blue */
  --secondary-color: #1A6CAB; /* Darker blue for hover */
  --accent-color: #FFFFFF; /* White for form background */
  --highlight-color: #F35D0C; /* Orange for emphasis */
  --text-color: #323232; /* Dark gray for text */
  --background-color: #000000; /* Black for page background */
  --input-border-color: #CCCCCC; /* Light gray for input borders */
  --input-focus-color: #2D8BD9; /* Blue for focused input border */
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  width: 100%; /* Ensure full width for the container */
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
}

h2, h3 {
  text-align: left;
  margin-bottom: 20px;
}

h2 {
  margin-top: 0; /* Ensure the heading starts within the container */
  padding-top: 50px; /* Add some padding to give space around it */
  color: var(--main-color);
  text-align: center;
  font-size: 1.8em; /* Ensure readability on smaller screens */
}

.level-selector {
  margin-bottom: 20px;
}

select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid var(--input-border-color);
  font-size: 16px;
  margin-left: 10px;
}

select:focus {
  border-color: var(--input-focus-color);
  outline: none;
}

/* Add Question Form */
.add-question-container {
  width: 100%;
  max-width: 600px;
  background-color: var(--accent-color);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
}

.add-question-container h3 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--text-color);
}

input[type="text"], textarea {
  padding: 10px;
  border: 1px solid var(--input-border-color);
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

textarea {
  resize: none;
}

input[type="text"]:focus, textarea:focus {
  border-color: var(--input-focus-color);
  outline: none;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.answer-section {
  border-top: 1px solid var(--input-border-color);
  padding-top: 15px;
  margin-top: 15px;
}

.answer-section h4 {
  color: var(--main-color);
  margin-bottom: 10px;
}

/* Buttons */
button {
  padding: 12px 20px;
  background-color: var(--main-color);
  color: var(--accent-color);
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  text-align: center;
}

button:hover {
  background-color: var(--secondary-color);
  transform: scale(1.05);
}

.add-button {
  width: 100%;
  margin: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.update-button {
  background-color: var(--main-color);
}

.update-button:hover {
  background-color: var(--secondary-color);
}

.delete-button {
  background-color: #d9534f; /* Red for delete button */
}

.delete-button:hover {
  background-color: #c9302c;
}

/* Accordion Styles */
.accordion-item {
  width: 100%;
  border: 1px solid var(--input-border-color);
  border-radius: 8px;
  background-color: var(--accent-color);
  margin-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: left;
  padding: 15px;
  cursor: pointer;
  background-color: var(--main-color);
  color: var(--accent-color);
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.accordion-header:hover {
  background-color: var(--secondary-color);
}

.accordion-content {
  padding: 15px;
  background-color: var(--accent-color);
  color: var(--text-color);
  border-top: 1px solid var(--input-border-color);
}

/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

