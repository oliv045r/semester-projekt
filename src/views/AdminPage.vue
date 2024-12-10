<template>
  <div class="admin-container">
    <h2>Admin Page</h2>
    <form @submit.prevent="addQuiz">
      <div>
        <label for="quizId">Quiz ID:</label>
        <input type="text" v-model="quizId" required />
      </div>
      <div>
        <label for="quizType">Quiz Type:</label>
        <select v-model="quizType" required>
          <option value="50/50">50/50</option>
          <option value="Quiz">Quiz</option>
        </select>
      </div>
      <div>
        <label for="level">Level:</label>
        <input type="number" v-model="level" required />
      </div>
      <div>
        <label for="questionText">Question Text:</label>
        <input type="text" v-model="questionText" required />
      </div>
      <div>
        <label for="answer1">Answer 1:</label>
        <input type="text" v-model="answers[0].text" required />
        <label for="feedback1">Feedback 1:</label>
        <input type="text" v-model="answers[0].feedback" required />
        <label for="isCorrect1">Is Correct:</label>
        <input type="checkbox" v-model="answers[0].isCorrect" />
      </div>
      <div>
        <label for="answer2">Answer 2:</label>
        <input type="text" v-model="answers[1].text" required />
        <label for="feedback2">Feedback 2:</label>
        <input type="text" v-model="answers[1].feedback" required />
        <label for="isCorrect2">Is Correct:</label>
        <input type="checkbox" v-model="answers[1].isCorrect" />
      </div>
      <button type="submit">Add Quiz</button>
    </form>
  </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

export default {
  name: 'AdminPage',
  data() {
    return {
      quizId: '',
      quizType: '50/50',
      level: 1,
      questionText: '',
      answers: [
        { text: '', feedback: '', isCorrect: false },
        { text: '', feedback: '', isCorrect: false }
      ]
    };
  },
  methods: {
    async addQuiz() {
      try {
        // Add quiz to quizzes collection
        await setDoc(doc(db, "quizzes", this.quizId), {
          quizId: this.quizId,
          quizType: this.quizType,
          level: this.level
        });

        // Add question to questions collection
        const questionId = `q${Date.now()}`; // Generate a unique question ID
        await setDoc(doc(db, "questions", questionId), {
          questionId: questionId,
          quizId: this.quizId,
          questionText: this.questionText,
          answers: this.answers
        });

        alert('Quiz and question added successfully!');
        this.resetForm();
      } catch (error) {
        console.error("Error adding quiz and question:", error);
      }
    },
    resetForm() {
      this.quizId = '';
      this.quizType = '50/50';
      this.level = 1;
      this.questionText = '';
      this.answers = [
        { text: '', feedback: '', isCorrect: false },
        { text: '', feedback: '', isCorrect: false }
      ];
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
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
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
</style>