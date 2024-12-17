<template>
  <div class="admin-container">
    <h2>Administrer Quiz Spørgsmål</h2>
    <div class="level-selector">
      <label for="level">Vælg niveau:</label>
      <select id="level" v-model="selectedLevel" @change="fetchQuestions">
        <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
      </select>
    </div>
    <button @click="showModal = true" class="add-button">Tilføj Quiz Spørgsmål</button>
    <QuestionModal
      :isVisible="showModal"
      modalTitle="Tilføj Quiz Spørgsmål"
      :showFeedback="false"
      :addQuestion="addQuestion"
      :closeModal="closeModal"
      :openGifModal="openGifModal"
    />
    <div v-if="questions.length > 0">
      <QuestionAccordion
        v-for="(question, index) in questions"
        :key="question.id"
        :question="question"
        :index="index"
        :isActive="activeIndex === index"
        :showFeedback="false"
        :toggleAccordion="toggleAccordion"
        :updateQuestion="updateQuestion"
        :deleteQuestion="deleteQuestion"
        :openGifModal="openGifModal"
      />
    </div>
    <div v-else>
      <p>Ingen spørgsmål fundet for dette niveau.</p>
    </div>
    <GifModal :isVisible="gifModalVisible" @close="closeGifModal" @select="selectGif" />
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, setDoc, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import QuestionAccordion from '@/components/admin/QuestionAccordion.vue';
import QuestionModal from '@/components/admin/QuestionModal.vue';
import GifModal from '@/components/elements/GifModal.vue';

export default {
  name: 'ManageQuiz',
  components: { QuestionAccordion, QuestionModal, GifModal },
  data() {
    return {
      selectedLevel: 1,
      levels: [1, 2, 3, 4, 5], // Define the levels
      showModal: false,
      gifModalVisible: false,
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
        this.showModal = false;
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
    closeModal() {
      this.showModal = false;
    },
    openGifModal() {
      this.gifModalVisible = true;
    },
    closeGifModal() {
      this.gifModalVisible = false;
    },
    selectGif() {
      // Handle the selected GIF URL
      this.gifModalVisible = false;
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
  text-align: left;
  padding: 15px;
  cursor: pointer;
  background-color: var(--main-color);
  color: var(--accent-color);
  font-size: 16px;
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
