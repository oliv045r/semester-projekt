<template>
  <div class="results-container">
    <h2>QUIZ</h2>
    <p>Niveau gennemført!</p>

    <!-- Results List -->
    <ResultsDisplay :answeredQuestions="answeredQuestions" />

    <!-- Buttons -->
    <NextButtons @retry="goToHome" @next="goToQuiz" />
  </div>
</template>

<script>
import ResultsDisplay from "@/components/result/ResultsDisplay.vue";
import NextButtons from "@/components/result/NextButtons.vue";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

export default {
  name: "QuizResult",
  components: { ResultsDisplay, NextButtons },
  data() {
    return {
      answeredQuestions: [],
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

      const answeredQuestions = await Promise.all(
        querySnapshot.docs.map(async (docSnapshot) => {
          const data = docSnapshot.data();
          const questionDoc = await getDoc(doc(db, `QuizQuestions`, data.questionId));
          if (!questionDoc.exists()) return null;
          const questionData = questionDoc.data();

          return {
            questionText: questionData.questionText,
            selectedAnswerText: questionData.answers[data.selectedAnswer]?.text,
            isCorrect: data.isCorrect,
          };
        })
      );

      this.answeredQuestions = answeredQuestions.filter((q) => q !== null);
    }
  },
  methods: {
    goToHome() {
      this.$router.push("/vælg-sværhedsgrad");
    },
    goToQuiz() {
      this.$router.push("/quiz");
    },
  },
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
  color: var(--text-color);
}

h2 {
  color: var(--secondary-color);
}

p {
  margin: 10px 0;
  font-size: 1.2rem;
  text-align: center;
}
</style>