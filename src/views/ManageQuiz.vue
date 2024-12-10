<template>
  <div class="admin-container">
    <h2>Manage Quiz Questions</h2>
    <div class="level-selector">
      <label for="level">Select Level:</label>
      <select v-model="selectedLevel" @change="fetchQuestions" required>
        <option value="1">Level 1</option>
        <option value="2">Level 2</option>
        <option value="3">Level 3</option>
        <option value="4">Level 4</option>
        <option value="5">Level 5</option>
      </select>
    </div>
    <button @click="showAddForm = !showAddForm">{{ showAddForm ? 'Cancel' : 'Add Quiz Question' }}</button>
    <div v-if="showAddForm">
      <h3>Add Quiz Question</h3>
      <form @submit.prevent="addQuestion">
        <div>
          <label for="questionText">Question Text:</label>
          <input type="text" v-model="newQuestion.questionText" required />
        </div>
        <div v-for="(answer, index) in newQuestion.answers" :key="index">
          <label :for="'answer' + index">Answer {{ index + 1 }}:</label>
          <input :id="'answer' + index" type="text" v-model="answer.text" required />
          <div class="input-container">
            <label :for="'isCorrect' + index">Is Correct:</label>
            <input :id="'isCorrect' + index" type="checkbox" v-model="answer.isCorrect" />
          </div>
        </div>
        <button type="submit">Add Question</button>
      </form>
    </div>
    <div v-else>
      <h3>Questions for Level {{ selectedLevel }}</h3>
      <div v-if="questions.length > 0">
        <div v-for="(question, index) in questions" :key="question.id" class="accordion-item">
          <div class="accordion-header" @click="toggleAccordion(index)">
            <h3>{{ question.questionText }}</h3>
            <span>{{ activeIndex === index ? '-' : '+' }}</span>
          </div>
          <div v-if="activeIndex === index" class="accordion-content">
            <form @submit.prevent="updateQuestion(question.id)">
              <div>
                <label for="questionText">Question Text:</label>
                <input type="text" v-model="question.questionText" required />
              </div>
              <div v-for="(answer, index) in question.answers" :key="index">
                <label :for="'answer' + index">Answer {{ index + 1 }}:</label>
                <input :id="'answer' + index" type="text" v-model="answer.text" required />
                <div class="input-container">
                  <label :for="'isCorrect' + index">Is Correct:</label>
                  <input :id="'isCorrect' + index" type="checkbox" v-model="answer.isCorrect" />
                </div>
              </div>
              <button type="submit">Update Question</button>
              <button type="button" @click="deleteQuestion(question.id)">Delete Question</button>
            </form>
          </div>
        </div>
      </div>
      <div v-else>
        <p>No questions found for this level.</p>
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
.admin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.level-selector {
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

input, select {
  padding: 5px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: var(--main-color);
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: var(--secondary-color);
}

.accordion-item {
  width: 100%;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  background-color: #323232;
  color: white;
}

.accordion-content {
  padding: 1rem;
  background-color: #444;
  color: white;
}
</style>