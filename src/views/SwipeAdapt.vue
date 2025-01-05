<template>
   <div class="quiz-container" v-if="questions.length > 0">
      <!-- Swipe Animation: vis kun på spørgsmål 1 i niveau 1 -->
      <SwipeAnimation v-if="showSwipeAnimation" />
      <p class="question-number">Niveau {{ currentLevel }} - Spørgsmål {{ totalQuestionsAnswered + 1 }}</p>
      <div class="question">
         <p>{{ currentQuestion.questionText }}</p>
      </div>
      <div class="answers">
         <div
            tabindex="1"
            class="answer left"
            v-gesture="handleSwipe"
            :class="{ swiped: swipedLeft }"
            @click="handleClick('left')"
            @keydown="handleKeydown('left', $event)"
            :aria-label="`Answer: ${currentQuestion.answers[0].text}`">
            {{ currentQuestion.answers[0].text }}
         </div>
         <div
            tabindex="2"
            class="answer right"
            v-gesture="handleSwipe"
            :class="{ swiped: swipedRight }"
            @click="handleClick('right')"
            @keydown="handleKeydown('right', $event)"
            :aria-label="`Answer: ${currentQuestion.answers[1].text}`">
            {{ currentQuestion.answers[1].text }}
         </div>
      </div>
      <FeedbackLeft
         :isVisible="showFeedbackLeft"
         :class="feedbackBorderClass"
         :feedbackHeading="currentQuestion.answers[0].feedbackHeading"
         :feedbackDesc="currentQuestion.answers[0].feedback"
         :gifUrl="currentQuestion.answers[0].gifUrl"
         :gifAlt="currentQuestion.answers[0].gifAlt" 
         @next="nextQuestion" />
      <FeedbackRight
         :isVisible="showFeedbackRight"
         :class="feedbackBorderClass"
         :feedbackHeading="currentQuestion.answers[1].feedbackHeading"
         :feedbackDesc="currentQuestion.answers[1].feedback"
         :gifUrl="currentQuestion.answers[1].gifUrl"
         :gifAlt="currentQuestion.answers[1].gifAlt" 
         @next="nextQuestion" />
   </div>
   <div v-else>
      <p>Loading questions...</p>
   </div>
</template>

<script>
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import FeedbackLeft from "@/components/quiz/FeedbackLeft.vue";
import FeedbackRight from "@/components/quiz/FeedbackRight.vue";
import SwipeAnimation from "@/components/elements/SwipeAnimation.vue";

export default {
   name: "SwipeAdapt",
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
         feedbackBorderClass: "", // Ny variabel til CSS-klasser
         showFeedbackLeft: false,
         showFeedbackRight: false,
         showSwipeAnimation: false, // Tilføj variabel til animation
         currentLevel: 1,
         correctAnswers: 0,
         incorrectAnswers: 0,
         totalQuestionsAnswered: 0,
         answeredQuestions: new Set(), // Track answered questions to avoid repetition
      };
   },
   computed: {
      currentQuestion() {
         return this.questions[this.currentQuestionIndex] || {};
      },
   },
   async created() {
      await this.fetchQuestions(this.currentLevel);
   },
   methods: {
      async fetchQuestions(level) {
         try {
            const q = query(collection(db, `SwipeQuestions`), where("SwipeLevel", "==", level.toString()));
            const querySnapshot = await getDocs(q);
            const newQuestions = querySnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            })).filter(question => !this.answeredQuestions.has(question.id));

            if (newQuestions.length > 0) {
               this.questions = newQuestions;
               this.currentQuestionIndex = 0;
            } else {
               // If no new questions, fetch from the nearest level
               if (level < 5) {
                  await this.fetchQuestions(level + 1);
               } else if (level > 1) {
                  await this.fetchQuestions(level - 1);
               }
            }
         } catch (error) {
            console.error("Error fetching questions:", error);
         }
      },
      async handleClick(direction) {
         if (direction === "left") {
            this.swipedLeft = true;
            this.showFeedbackLeft = true;
            this.showFeedbackRight = false;
            this.handleSwipe({ direction: "left" });
         } else if (direction === "right") {
            this.swipedRight = true;
            this.showFeedbackRight = true;
            this.showFeedbackLeft = false;
            this.handleSwipe({ direction: "right" });
         }
      },
      async handleKeydown(direction, event) {
         if (event.key === "Enter" || event.key === " ") {
            await this.handleClick(direction);
         }
      },
      async handleSwipe(direction) {
         const selectedAnswer = direction === "left" ? 0 : 1;
         const isCorrect = this.currentQuestion.answers[selectedAnswer].isCorrect;

         this.feedbackBorderClass = isCorrect ? "correct-border" : "incorrect-border";

         // Fjern klassen efter 2 sekunder
         setTimeout(() => {
            this.feedbackBorderClass = "";
         }, 2000);

         this.checkAnswer(direction);
      },
      async checkAnswer(direction) {
         const selectedAnswer = direction === "left" ? 0 : 1;
         const isCorrect = this.currentQuestion.answers[selectedAnswer].isCorrect;

         if (isCorrect) {
            this.correctAnswers++;
            this.incorrectAnswers = 0; // Reset incorrect answers
            if (this.currentLevel < 5) {
               this.currentLevel++;
            }
         } else {
            this.incorrectAnswers++;
            if (this.incorrectAnswers >= 2 && this.currentLevel > 1) {
               this.currentLevel--;
               this.incorrectAnswers = 0; // Reset incorrect answers
            }
         }

         this.totalQuestionsAnswered++;
         this.answeredQuestions.add(this.currentQuestion.id);

         if (this.totalQuestionsAnswered >= 10) {
            this.endQuiz();
         } else {
            await this.fetchQuestions(this.currentLevel);
         }
      },
      async nextQuestion() {
         this.swipedLeft = false;
         this.swipedRight = false;
         this.showFeedbackLeft = false;
         this.showFeedbackRight = false;

         if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
         } else {
            await this.fetchQuestions(this.currentLevel);
         }
      },
      async endQuiz() {
         const level = this.currentLevel;
         this.$router.push({ name: "SwipeResult", params: { level } });
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
   font-weight: normal;
   color: var(--text-color);
}

.answers {
   display: flex;
   flex-direction: column;
   justify-content: space-between;
   width: 100%;
   color: var(--text-color);
}

.answer {
   width: 83%;
   padding: 30px;
   text-align: left;
   cursor: pointer;
   transition: transform 0.3s ease;
}

.answer.left {
   align-self: flex-end;
   background-color: var(--main-color);
   clip-path: polygon(10% 0, 100% 0, 100% 100%, 92% 100%, 10% 100%, 0 50%);
}

.answer.right {
   padding-left: 40px;
   padding-right: 20px;
   margin-top: 1rem;
   align-self: flex-start;
   background-color: var(--secondary-color);
   clip-path: polygon(0% 0, 90% 0, 100% 50%, 90% 100%, 0% 100%, 0 50%);
}

.answer.left.swiped {
   transform: translateX(-100%);
}

.answer.right.swiped {
   transform: translateX(100%);
}

.correct-border {
   box-shadow: rgb(0, 255, 0) 0px 0px 20px 8px inset;
   box-sizing: border-box;
}

.incorrect-border {
   box-shadow: rgb(255, 0, 0) 0px 0px 20px 8px inset;
   box-sizing: border-box;
}

.correct-border,
.incorrect-border {
   transition: border 0.3s ease-in-out;
}
</style>
