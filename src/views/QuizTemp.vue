<template>
  <div class="quiz-container" v-if="questions.length > 0">
    <div class="question">{{ currentQuestion.question }}</div>
    <div class="answers">
      <div
        class="answer left"
        v-gesture="handleSwipe"
        :class="{ swiped: swipedLeft }"
      >
        {{ currentQuestion.answers[0] }}
      </div>
      <div
        class="answer right"
        v-gesture="handleSwipe"
        :class="{ swiped: swipedRight }"
      >
        {{ currentQuestion.answers[1] }}
      </div>
    </div>
    <FeedbackLeft :isVisible="showFeedbackLeft" @next="nextQuestion" />
    <FeedbackRight :isVisible="showFeedbackRight" @next="nextQuestion" />
  </div>
  <div v-else>
    <p>Loading questions...</p>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import FeedbackLeft from '@/components/quiz/FeedbackLeft.vue';
import FeedbackRight from '@/components/quiz/FeedbackRight.vue';

export default {
  name: 'QuizTemp',
  components: {
    FeedbackLeft,
    FeedbackRight,
  },
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      swipedLeft: false,
      swipedRight: false,
      showFeedbackLeft: false,
      showFeedbackRight: false,
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
    checkAnswer(direction) {
      const selectedAnswer = direction === 'left' ? 0 : 1;
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
      this.swipedLeft = false;
      this.swipedRight = false;
      this.showFeedbackLeft = false;
      this.showFeedbackRight = false;
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        this.$router.push('/resultat');
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
.question {
  margin: 20px;
  font-size: 24px;
}
.answers {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
}
.answer {
  width: 85%;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.answer.left {
  align-self: flex-end;
  background-color: var(--main-color);
  clip-path: polygon(3% 0, 100% 0, 100% 100%, 90% 100%, 3% 100%, 0 50%);

}

.answer.right {
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