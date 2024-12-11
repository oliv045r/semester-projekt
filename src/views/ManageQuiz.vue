<template>
  <div class="admin-container">
    <h2>Administrer Quizspørgsmål</h2>
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
      {{ showAddForm ? 'Annuller' : 'Tilføj Quizspørgsmål' }}
    </button>
    <div v-if="showAddForm" class="add-question-container">
      <h3>Tilføj Quizspørgsmål</h3>
      <form @submit.prevent="addQuestion">
        <div class="form-group">
          <label for="questionText">Spørgsmålstekst:</label>
          <input type="text" id="questionText" v-model="newQuestion.questionText" required />
        </div>
        <div class="answer-section" v-for="(answer, index) in newQuestion.answers" :key="index">
          <h4>Svar {{ index + 1 }}</h4>
          <div class="form-group">
            <label :for="'answer' + index">Tekst:</label>
            <input :id="'answer' + index" type="text" v-model="answer.text" required />
          </div>
          <div class="form-group checkbox-group">
            <label :for="'isCorrect' + index">Er Korrekt:</label>
            <input :id="'isCorrect' + index" type="checkbox" v-model="answer.isCorrect" />
          </div>
        </div>
        <button type="submit" class="add-button">Tilføj Spørgsmål</button>
      </form>
    </div>
    <div v-else>
      <h3>Spørgsmål for Niveau {{ selectedLevel }}</h3>
      <div v-if="questions.length > 0">
        <div v-for="(question, index) in questions" :key="question.id" class="accordion-item">
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
              <div
                class="answer-section"
                v-for="(answer, index) in question.answers"
                :key="index"
              >
                <h4>Svar {{ index + 1 }}</h4>
                <div class="form-group">
                  <label :for="'answer' + index">Tekst:</label>
                  <input :id="'answer' + index" type="text" v-model="answer.text" required />
                </div>
                <div class="form-group checkbox-group">
                  <label :for="'isCorrect' + index">Er Korrekt:</label>
                  <input :id="'isCorrect' + index" type="checkbox" v-model="answer.isCorrect" />
                </div>
              </div>
              <div class="button-group">
                <button type="submit" class="update-button">Opdater Spørgsmål</button>
                <button
                  type="button"
                  class="delete-button"
                  @click="deleteQuestion(question.id)"
                >
                  Slet Spørgsmål
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div v-else>
        <p>Ingen spørgsmål fundet for dette niveau.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

export default {
  name: 'ManageQuiz',
  data() {
    return {
      selectedLevel: 1,
      showAddForm: false,
      questions: [],
      activeIndex: null,
      newQuestion: {
        questionText: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      }
    };
  },
  methods: {
    async fetchQuestions() {
      try {
        const q = query(collection(db, "QuizQuestions"), where("QuizLevel", "==", this.selectedLevel.toString()));
        const querySnapshot = await getDocs(q);
        this.questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    },
    async addQuestion() {
      try {
        const questionId = `q${Date.now()}`;
        await setDoc(doc(db, "QuizQuestions", questionId), {
          questionId,
          QuizLevel: this.selectedLevel.toString(),
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
        await updateDoc(doc(db, "QuizQuestions", questionId), question);
        this.fetchQuestions();
      } catch (error) {
        console.error("Error updating question:", error);
      }
    },
    async deleteQuestion(questionId) {
      try {
        await deleteDoc(doc(db, "QuizQuestions", questionId));
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
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
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
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
}

h2, h3 {
  text-align: center;
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

input[type="text"] {
  padding: 10px;
  border: 1px solid var(--input-border-color);
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input[type="text"]:focus {
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
}

button:hover {
  background-color: var(--secondary-color);
  transform: scale(1.05);
}

.add-button {
  width: 100%;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.update-button {
  background-color: var(--main-color);
}

.delete-button {
  background-color: #d9534f;
}

.accordion-item {
  width: 95vw; /* Full width of the viewport */
  margin: 0 auto 10px; /* Center align with vertical spacing */
  border: 1px solid var(--input-border-color);
  border-radius: 8px;
  background-color: var(--accent-color);
  color: var(--accent-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Prevent content overflow */
  margin-left: 8px;
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
