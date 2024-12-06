<template>
  <div class="quiz-container" v-if="questions.length > 0">
    <div class="question">{{ currentQuestion.question }}</div>
    <div class="answers">
      <div
        class="answer right"
        @touchstart="startSwipe"
        @touchmove="moveSwipe"
        @touchend="endSwipe('right')"
      >
        {{ currentQuestion.answers[1] }}
      </div>
      <div
        class="answer left"
        @touchstart="startSwipe"
        @touchmove="moveSwipe"
        @touchend="endSwipe('left')"
      >
        {{ currentQuestion.answers[0] }}
      </div>
    </div>
    <div v-if="feedback" class="feedback">
      <p>{{ feedback }}</p>
      <button @click="nextQuestion">Next Question</button>
    </div>
  </div>
  <div v-else>
    <p>Loading questions...</p>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default {
  name: 'QuizTemp',
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      feedback: null,
      startX: 0,
      currentX: 0,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
  },
  async created() {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      this.questions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  },
  methods: {
    startSwipe(event) {
      this.startX = event.touches[0].clientX;
    },
    moveSwipe(event) {
      this.currentX = event.touches[0].clientX;
    },
    endSwipe(side) {
      const deltaX = this.currentX - this.startX;
      if ((side === "left" && deltaX > 50) || (side === "right" && deltaX < -50)) {
        this.checkAnswer(side);
      }
    },
    checkAnswer(side) {
      const correctAnswer = this.currentQuestion.correctAnswer;
      const selectedAnswer = side === "left" ? 0 : 1;
      if (selectedAnswer === correctAnswer) {
        this.feedback = "Correct!";
      } else {
        this.feedback = "Wrong!";
      }
      this.logAnswer(selectedAnswer);
    },
    async logAnswer(selectedAnswer) {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "userAnswers"), {
          userId: user.uid,
          questionId: this.currentQuestion.id,
          selectedAnswer,
          timestamp: new Date(),
        });
      }
    },
    nextQuestion() {
      this.feedback = null;
      this.currentQuestionIndex++;
    },
  },
};
</script>

<style scoped>
.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.question {
  margin: 20px;
  font-size: 24px;

}
.answers {
  display: flex;
  justify-content: space-between;
  width: 100%;  
  display: flex;
  flex-direction: column;
}
.answer {
  width: 95%;
  padding: 20px 0;
  background-color: #f0f0f0;
  text-align: center;
  cursor: pointer;
}
.answer.left {
  position: absolute;
  top: 30rem;
  left: 0;
  transform: translateX(-0%);
  background-color: var(--secondary-color);

}
.answer.right {
  position: absolute;
  top: 20rem;
  right: 0;
  transform: translateX(0%);
  background-color: var(--main-color);
}
.feedback {
  margin-top: 20px;
}
</style>