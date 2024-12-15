<template>
  <div class="quiz-container" v-if="questions.length > 0">
    <p class="question-number">Spørgsmål {{ currentQuestionIndex + 1 }}</p>
    <div class="question">
      <p>{{ currentQuestion.questionText }}</p>
    </div>
    <div class="answers">
      <div
        v-for="(answer, index) in currentQuestion.answers"
        :key="index"
        class="answer"
        :class="{ selected: selectedAnswerIndex === index, correct: selectedAnswerIndex === index && answer.isCorrect, incorrect: selectedAnswerIndex === index && !answer.isCorrect }"
        @click="selectAnswer(index)"
      >
        {{ answer.text }}
      </div>
    </div>
    <button v-if="selectedAnswerIndex !== null" @click="nextQuestion">Next</button>
  </div>
  <div v-else>
    <p>Loading questions...</p>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

export default {
  name: 'QuizGame',
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswerIndex: null,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
  },
  async created() {
    try {
      const level = this.$route.params.level; // Assuming level is passed as a route parameter
      console.log("Fetching questions for level:", level); // Log the level
      const q = query(collection(db, `QuizQuestions`), where("QuizLevel", "==", level.toString())); // Query as string
      console.log("Query:", q); // Log the query
      const querySnapshot = await getDocs(q);
      this.questions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Fetched questions:", this.questions); // Log the fetched questions
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  },
  methods: {
    selectAnswer(index) {
      if (this.selectedAnswerIndex === null) {
        this.selectedAnswerIndex = index;
        this.logAnswer(index);
      }
    },
    async logAnswer(selectedAnswer) {
      const user = auth.currentUser;
      if (user) {
        const question = this.currentQuestion;
        const isCorrect = question.answers[selectedAnswer].isCorrect;
        const level = this.$route.params.level; // Get the level from the route parameters
        const quizId = `QuizQuestions${level}`;

        // Check if the answer already exists
        const q = query(
          collection(db, `users/${user.uid}/progress`),
          where("questionId", "==", question.id)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Update the existing document
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            selectedAnswer,
            isCorrect,
            timestamp: new Date(),
            quizId // Include quizId in the document
          });
        } else {
          // Add a new document
          await addDoc(collection(db, `users/${user.uid}/progress`), {
            questionId: question.id,
            selectedAnswer,
            isCorrect,
            timestamp: new Date(),
            quizId // Include quizId in the document
          });
        }
      }
    },
    async nextQuestion() {
      this.selectedAnswerIndex = null;
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        const level = this.$route.params.level; // Get the level from the route parameters
        const user = auth.currentUser;
        const progressRef = collection(db, `users/${user.uid}/progress`);
        const q = query(progressRef, where("quizId", "==", `QuizQuestions${level}`));
        const querySnapshot = await getDocs(q);
        const correctAnswers = querySnapshot.docs.filter(doc => doc.data().isCorrect).length;
        const totalAnswers = querySnapshot.docs.length;
        const percentage = (correctAnswers / totalAnswers) * 100;

        if (percentage > 75) {
          const userDocRef = doc(db, `users/${user.uid}`);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
          const maxSwipeLevel = userData.maxSwipeLevel || 1;

          if (level == 1) {
            await updateDoc(userDocRef, {
              maxSwipeLevel: Math.max(maxSwipeLevel, 2),
            });
          } else if (level == 2) {
            await updateDoc(userDocRef, {
              maxSwipeLevel: Math.max(maxSwipeLevel, 3),
            });
          } else if (level == 3) {
            await updateDoc(userDocRef, {
              maxSwipeLevel: Math.max(maxSwipeLevel, 4),
            });
          } else if (level == 4) {
            await updateDoc(userDocRef, {
              maxSwipeLevel: Math.max(maxSwipeLevel, 5),
            });
          }
        }

        this.$router.push({ name: 'QuizResult', params: { level } }); // Navigate to ResultPage with level
      }
    },
  },
};
</script>

<style scoped>
.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100vw;
}

.question-number {
  font-size: 25px;
  font-weight: 600;
}

.question {
  margin: 20px;
  font-size: 24px;
  text-align: left;
}

.answers {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}

.answer {
  width: 85%;
  padding: 30px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.3s ease;
  background-color: var(--main-color);
  margin: 10px 0;
}

.answer.selected {
  background-color: var(--secondary-color);
}

.answer.correct {
  background-color: green;
}

.answer.incorrect {
  background-color: red;
}

button {
  padding: 10px 20px;
  background-color: var(--main-color);
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: var(--secondary-color);
}
</style>