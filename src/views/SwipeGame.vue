<template>
  <div class="quiz-container" v-if="questions.length > 0">
    <p class="question-number">{{ currentQuestionIndex + 1 }}</p>
    <div class="question">
      <h2>{{ currentQuestion.questionText }}</h2>
    </div>
    <div class="answers">
      <div
        class="answer left slide-in-left"
        v-gesture="handleSwipe"
        :class="{ swiped: swipedLeft, active: animateLeft }"
      >
        {{ currentQuestion.answers[0].text }}
      </div>
      <div
        class="answer right slide-in-right"
        v-gesture="handleSwipe"
        :class="{ swiped: swipedRight, active: animateRight }"
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
import { collection, getDocs, query, where, addDoc, updateDoc } from "firebase/firestore";
import FeedbackLeft from '@/components/quiz/FeedbackLeft.vue';
import FeedbackRight from '@/components/quiz/FeedbackRight.vue';

export default {
  name: 'SwipeGame',
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
      animateLeft: false,
      animateRight: false,
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
      const q = query(collection(db, `SwipeQuestions`), where("SwipeLevel", "==", level.toString())); // Query as string
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout(() => {
        vm.animateLeft = true;
      }, 100);
      setTimeout(() => {
        vm.animateRight = true;
      }, 200);
    });
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
        const question = this.currentQuestion;
        const isCorrect = question.answers[selectedAnswer].isCorrect;
        const level = this.$route.params.level; // Get the level from the route parameters
        const quizId = `SwipeQuestions${level}`;

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
    nextQuestion() {
      this.swipedLeft = false;
      this.swipedRight = false;
      this.showFeedbackLeft = false;
      this.showFeedbackRight = false;
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
      } else {
        const level = this.$route.params.level; // Get the level from the route parameters
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

.slide-in-left {
  transform: translateX(100%); 
  opacity: 0;
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}

.slide-in-left.active {
  transform: translateX(0);
  opacity: 1;
}

.slide-in-right {
  transform: translateX(-100%);
  opacity: 0;
  transition: transform 0.5s ease-out, opacity 0.5s ease-out;
}

.slide-in-right.active {
  transform: translateX(0);
  opacity: 1;
}
</style>