<template>
  <div class="results-container">
    <h2>Quiz Fuldført</h2>
    <p class="congratulations-message">Tillykke! Du har gennemført quizzen.</p>
    <div v-if="answeredQuestions.length > 0">
      <div v-for="(question, index) in answeredQuestions" :key="index" class="accordion-item">
        <div class="accordion-header" @click="toggleAccordion(index)">
          <h3 class="question-text">{{ question.questionText }}</h3>
          <span :class="{'correct': question.isCorrect, 'wrong': !question.isCorrect}">
            {{ question.isCorrect ? '✔' : '✖' }}
          </span>
        </div>
        <div v-if="activeIndex === index" class="accordion-content">
          <p><strong>Valgt svar:</strong> {{ question.selectedAnswerText }}</p>
          <p><strong>Feedback overskrift:</strong> {{ question.feedbackHeading }}</p>
          <p><strong>Feedback:</strong> {{ question.feedback }}</p>
        </div>
      </div>
    </div>
    <button @click="goToHome" class="home-button">Gå til Hjem</button>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

export default {
  name: 'ResultPage',
  data() {
    return {
      answeredQuestions: [],
      activeIndex: null,
    };
  },
  async created() {
    const level = this.$route.params.level;
    const quizId = `SwipeQuestions${level}`;
    if (quizId) {
      const user = auth.currentUser;
      const progressRef = collection(db, `users/${user.uid}/progress`);
      const q = query(progressRef, where("quizId", "==", quizId));
      const querySnapshot = await getDocs(q);

      const answeredQuestions = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const questionDoc = await getDoc(doc(db, `SwipeQuestions`, data.questionId));
          if (!questionDoc.exists()) {
            return null;
          }
          const questionData = questionDoc.data();

          return {
            questionText: questionData.questionText,
            selectedAnswerText: questionData.answers[data.selectedAnswer].text,
            feedbackHeading: questionData.answers[data.selectedAnswer].feedbackHeading,
            feedback: questionData.answers[data.selectedAnswer].feedback,
            isCorrect: data.isCorrect,
          };
        })
      );

      this.answeredQuestions = answeredQuestions.filter((q) => q !== null);
    }
  },
  methods: {
    toggleAccordion(index) {
      this.activeIndex = this.activeIndex === index ? null : index;
    },
    goToHome() {
      this.$router.push('/vælg-sværhedsgrad');
    }
  }
};
</script>

<style scoped>
.results-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

.results-container h2 {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #2d8bd9;
}

.congratulations-message {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.accordion-item {
  width: 100%;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  border-radius: 5px;
  overflow: hidden;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.accordion-header:hover {
  background-color: #F35D0C;
}

.accordion-content {
  padding: 10px 15px;
  font-size: 0.9rem;
  line-height: 1.6;
  text-align: left;
}

.correct {
  color: #28a745;
}

.wrong {
  color: #dc3545;
}

.home-button {
  align-self: flex-start;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  color: white;
  background-color: #2d8bd9;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.question-text {
  text-align: left;
}

.home-button:hover {
  background-color: #1a6cab;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .results-container {
    padding: 15px;
  }

  .results-container h2 {
    font-size: 1.5rem;
  }

  .congratulations-message {
    font-size: 1rem;
  }

  .home-button {
    font-size: 0.9rem;
    padding: 8px 16px;
  }
}
</style>
