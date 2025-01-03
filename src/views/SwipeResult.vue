<template>
  <div class="results-container" aria-live="polite">
    <h2 class="results-title" aria-label="Swipe results">SWIPE</h2>
    <h3 class="level-completed" :aria-label="`Level ${$route.params.level} completed`">Niveau {{ $route.params.level }} gennemført!</h3>

    <!-- Results List -->
    <ResultsDisplay :answeredQuestions="answeredQuestions" aria-label="Results display" />

    <!-- Buttons -->
    <NextButtons @retry="goToHome" @next="goToQuiz" aria-label="Next buttons" />
  </div>
</template>

<script>
import ResultsDisplay from "@/components/result/ResultsDisplay.vue";
import NextButtons from "@/components/result/NextButtons.vue";
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, doc, getDoc, updateDoc } from "firebase/firestore";

export default {
  name: "SwipeResult",
  components: { ResultsDisplay, NextButtons },
  data() {
    return {
      answeredQuestions: [],
      correctAnswers: 0,
    };
  },
  async created() {
    const level = this.$route.params.level;
    const quizId = `SwipeQuestions${level}`;

    if (quizId) {
      const user = auth.currentUser;
      if (!user) return; // Sikrer at der er en bruger

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
            isCorrect: data.isCorrect,
          };
        })
      );

      // Filter og gem besvarelser
      this.answeredQuestions = answeredQuestions.filter((q) => q !== null);

      // Beregn rigtige svar
      this.correctAnswers = this.answeredQuestions.filter((q) => q.isCorrect).length;

      // Opdater brugerens data i databasen
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      await updateDoc(userRef, {
        totalQuestions: (userData.totalQuestions || 0) + this.answeredQuestions.length,
        correctAnswers: (userData.correctAnswers || 0) + this.correctAnswers,
      });
    }
  },
  methods: {
    goToHome() {
      this.$router.push("/vælg-sværhedsgrad");
    },
    goToQuiz() {
      this.$router.push(`/quiz/${this.$route.params.level}`);
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
  color: var(--text-color);
  min-height: 100vh; /* Sørg for, at skærmen ikke kollapser */
}

.results-title {
  font-size: 2rem;
  color: var--main-color;
  margin-bottom: 10px;
  color: var(--text-color);
}

.level-completed {
  font-size: 1.5rem;
  margin-bottom: 20px;
}
</style>
