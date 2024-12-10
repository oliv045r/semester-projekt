<template>
  <div class="admin-container">
    <h2>Tilføj Swipe spørgsmål</h2>
    <form @submit.prevent="addQuiz">
      <div>
        <label for="level">Level:</label>
        <select v-model="level" required>
          <option value="1">Level 1</option>
          <option value="2">Level 2</option>
          <option value="3">Level 3</option>
          <option value="4">Level 4</option>
          <option value="5">Level 5</option>
        </select>
      </div>
      <div>
        <label for="questionText">Question Text:</label>
        <input type="text" v-model="questionText" required />
      </div>
      <div>
        <label for="answer1">Answer 1:</label>
        <input type="text" v-model="answers[0].text" required />
        <label for="feedbackHeading1">Feedback Heading 1:</label>
        <input type="text" v-model="answers[0].feedbackHeading" required />
        <label for="feedback1">Feedback 1:</label>
        <input type="text" v-model="answers[0].feedback" required />
        <div class="input-container">
          <label for="isCorrect1">Is Correct:</label>
          <input type="checkbox" v-model="answers[0].isCorrect" />
        </div>
      </div>
      <div>
        <label for="answer2">Answer 2:</label>
        <input type="text" v-model="answers[1].text" required />
        <label for="feedbackHeading2">Feedback Heading 2:</label>
        <input type="text" v-model="answers[1].feedbackHeading" required />
        <label for="feedback2">Feedback 2:</label>
        <input type="text" v-model="answers[1].feedback" required />
        <div class="input-container">
          <label for="isCorrect2">Is Correct:</label>
          <input type="checkbox" v-model="answers[1].isCorrect" />
        </div>
      </div>
      <button type="submit">Add Question</button>
    </form>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

export default {
  name: 'AddSwipe',
  data() {
    return {
      level: 1,
      questionText: '',
      answers: [
        { text: '', feedbackHeading: '', feedback: '', isCorrect: false },
        { text: '', feedbackHeading: '', feedback: '', isCorrect: false }
      ]
    };
  },
  methods: {
    async addQuiz() {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User is not authenticated");
        }
        const questionId = `q${Date.now()}`; // Generate a unique question ID
        await setDoc(doc(db, `SwipeQuestions`, questionId), {
          questionId: questionId,
          SwipeLevel: this.level.toString(), // Ensure SwipeLevel is stored as a string
          questionText: this.questionText,
          answers: this.answers
        });

        alert('Question added successfully!');
        this.resetForm();
      } catch (error) {
        console.error("Error adding question:", error);
      }
    },
    resetForm() {
      this.level = 1;
      this.questionText = '';
      this.answers = [
        { text: '', feedbackHeading: '', feedback: '', isCorrect: false },
        { text: '', feedbackHeading: '', feedback: '', isCorrect: false }
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
.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

input {
  width: 80%;
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