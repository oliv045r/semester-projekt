<template>
  <div class="quiz-container" v-if="questions.length > 0">
    <!-- Swipe Animation: vis kun på spørgsmål 1 i niveau 1 -->
    <SwipeAnimation v-if="showSwipeAnimation" />
    <p class="question-number">{{ currentQuestionIndex + 1 }}</p>
    <div class="question">
      <h2>{{ currentQuestion.questionText }}</h2>
    </div>
    <div class="answers">
      <div
        class="answer left"
        v-gesture="handleSwipe"
        :class="{ swiped: swipedLeft }"
      >
        {{ currentQuestion.answers[0].text }}
      </div>
      <div
        class="answer right"
        v-gesture="handleSwipe"
        :class="{ swiped: swipedRight }"
      >
        {{ currentQuestion.answers[1].text }}
      </div>
    </div>
    <FeedbackLeft
      :isVisible="showFeedbackLeft"
      :feedbackHeading="currentQuestion.answers[0].feedbackHeading"
      :feedbackDesc="currentQuestion.answers[0].feedback"
      @next="nextQuestion"
    />
    <FeedbackRight
      :isVisible="showFeedbackRight"
      :feedbackHeading="currentQuestion.answers[1].feedbackHeading"
      :feedbackDesc="currentQuestion.answers[1].feedback"
      @next="nextQuestion"
    />
  </div>
  <div v-else>
    <p>Loading questions...</p>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import FeedbackLeft from '@/components/quiz/FeedbackLeft.vue';
import FeedbackRight from '@/components/quiz/FeedbackRight.vue';
import SwipeAnimation from "@/components/elements/SwipeAnimation.vue";

export default {
  name: 'SwipeGame',
  components: {
    FeedbackLeft,
    FeedbackRight,
    SwipeAnimation,
  },
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      swipedLeft: false,
      swipedRight: false,
      showFeedbackLeft: false,
      showFeedbackRight: false,
      showSwipeAnimation: false, // Tilføj variabel til animation
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
  },
  async created() {
    try {
      const level = this.$route.params.level; // Hent niveau fra ruten
      console.log("Fetching questions for level:", level);
      const q = query(
        collection(db, `SwipeQuestions`),
        where("SwipeLevel", "==", level.toString())
      );
      const querySnapshot = await getDocs(q);
      this.questions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched questions:", this.questions);

      // Kontroller, om animation skal vises
      this.checkForSwipeAnimation();
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  },
  methods: {
    checkForSwipeAnimation() {
      const level = this.$route.params.level;
      const currentQuestion = this.questions[this.currentQuestionIndex];
      // Vis animation kun for niveau 1 og spørgsmål med id "q1733840920298"
      if (
        level === "1" &&
        currentQuestion &&
        currentQuestion.questionId === "q1733840920298"
      ) {
        this.showSwipeAnimation = true;
        setTimeout(() => {
        const animationElement = document.querySelector(".swipe-animation");
        if (animationElement) {
          animationElement.classList.add("hidden"); // Tilføj fade-out klassen
        }
        setTimeout(() => {
          this.showSwipeAnimation = false; // Fjern helt efter fade-out
        }, 1000); // Match fade-out tiden (1s i CSS)
      }, 6000);
      } else {
        this.showSwipeAnimation = false;
      }
    },
    handleSwipe(direction) {
      if (direction === 'left') {
        this.swipedLeft = true;
        this.showFeedbackLeft = true;
      } else if (direction === 'right') {
        this.swipedRight = true;
        this.showFeedbackRight = true;
      }
      this.checkAnswer(direction);
    },
    async checkAnswer(direction) {
      const selectedAnswer = direction === 'left' ? 0 : 1;
      this.logAnswer(selectedAnswer);
    },
    async logAnswer(selectedAnswer) {
      const user = auth.currentUser;
      if (user) {
        const question = this.currentQuestion;
        const isCorrect = question.answers[selectedAnswer].isCorrect;
        const level = this.$route.params.level;
        const quizId = `SwipeQuestions${level}`;

        const q = query(
          collection(db, `users/${user.uid}/progress`),
          where("questionId", "==", question.id)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, {
            selectedAnswer,
            isCorrect,
            timestamp: new Date(),
            quizId,
          });
        } else {
          await addDoc(collection(db, `users/${user.uid}/progress`), {
            questionId: question.id,
            selectedAnswer,
            isCorrect,
            timestamp: new Date(),
            quizId,
          });
        }
      }
    },
    async nextQuestion() {
      this.swipedLeft = false;
      this.swipedRight = false;
      this.showFeedbackLeft = false;
      this.showFeedbackRight = false;

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.checkForSwipeAnimation(); // Opdater animation baseret på næste spørgsmål
      } else {
        const level = this.$route.params.level; // Get the level from the route parameters
        const user = auth.currentUser;
        const progressRef = collection(db, `users/${user.uid}/progress`);
        const q = query(progressRef, where("quizId", "==", `SwipeQuestions${level}`));
        const querySnapshot = await getDocs(q);
        const correctAnswers = querySnapshot.docs.filter(doc => doc.data().isCorrect).length;
        const totalAnswers = querySnapshot.docs.length;
        const percentage = (correctAnswers / totalAnswers) * 100;

        if (percentage > 75) {
          const userDocRef = doc(db, `users/${user.uid}`);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
          const maxQuizLevel = userData.maxQuizLevel || 0;

          if (level == 1) {
            await updateDoc(userDocRef, {
              maxQuizLevel: Math.max(maxQuizLevel, 1),
            });
          } else if (level == 2) {
            await updateDoc(userDocRef, {
              maxQuizLevel: Math.max(maxQuizLevel, 2),
            });
          } else if (level == 3) {
            await updateDoc(userDocRef, {
              maxQuizLevel: Math.max(maxQuizLevel, 3),
            });
          } else if (level == 4) {
            await updateDoc(userDocRef, {
              maxQuizLevel: Math.max(maxQuizLevel, 4),
            });
          } else if (level == 5) {
            await updateDoc(userDocRef, {
              maxQuizLevel: Math.max(maxQuizLevel, 5)
            });
          }
        }

        this.$router.push({ name: 'SwipeResult', params: { level } }); // Navigate to SwipeResult with level
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
  font-size: 22px;
  text-align: left;
  font-weight:normal;
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
}

.answer.left {
  align-self: flex-end;
  background-color: var(--main-color);
  clip-path: polygon(3% 0, 100% 0, 100% 100%, 90% 100%, 3% 100%, 0 50%);

}

.answer.right {
  padding-left: 40px;
  padding-right: 20px;
  margin-top: 1rem;
  align-self: flex-start;
  background-color: var(--secondary-color);
  clip-path: polygon(0% 0, 97% 0, 100% 50%, 97% 100%, 00% 100%, 0 50%);
}
.answer.left.swiped {
  transform: translateX(-100%);
}
.answer.right.swiped {
  transform: translateX(100%);
}
</style>