<template>
  <div class="results-container">
    <h2>Quiz Completed</h2>
    <p>Congratulations! You have completed the quiz.</p>
    <div v-if="answeredQuestions.length > 0">
      <div v-for="(question, index) in answeredQuestions" :key="index" class="accordion-item">
        <div class="accordion-header" @click="toggleAccordion(index)">
          <h3>{{ question.questionText }}</h3>
          <span :class="{'correct': question.isCorrect, 'wrong': !question.isCorrect}">
            {{ question.isCorrect ? '✔️' : '❌' }}
          </span>
        </div>
        <div v-if="activeIndex === index" class="accordion-content">
          <p><strong>Selected Answer:</strong> {{ question.selectedAnswerText }}</p>
        </div>
      </div>
    </div>
    <button @click="goToHome">Go to Home</button>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

export default {
  name: 'QuizResult',
  data() {
    return {
      answeredQuestions: [],
      activeIndex: null,
    };
  },
  async created() {
    const level = this.$route.params.level;
    const quizId = `QuizQuestions${level}`;
    if (quizId) {
      const user = auth.currentUser;
      const progressRef = collection(db, `users/${user.uid}/progress`);
      const q = query(progressRef, where("quizId", "==", quizId));
      const querySnapshot = await getDocs(q);

      const answeredQuestions = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        console.log("Fetching question with ID:", data.questionId); // Log the question ID
        const questionDoc = await getDoc(doc(db, `QuizQuestions`, data.questionId));
        if (!questionDoc.exists()) {
          console.error("Question document does not exist:", data.questionId);
          return null;
        }
        const questionData = questionDoc.data();

        return {
          questionText: questionData.questionText,
          selectedAnswerText: questionData.answers[data.selectedAnswer].text,
          isCorrect: data.isCorrect,
        };
      }));

      this.answeredQuestions = answeredQuestions.filter(q => q !== null); // Filter out null values
    } else {
      console.error("quizId is undefined");
    }
  },
  methods: {
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
    goToHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
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
}

.accordion-content {
  padding: 1rem;
  background-color: #323232;
}

.correct {
  color: green;
}

.wrong {
  color: red;
}
</style>