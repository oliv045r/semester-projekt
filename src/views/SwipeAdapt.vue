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
import { db } from "@/firebase/firebaseConfig"; // Importer Firebase konfiguration
import { collection, getDocs, query, where } from "firebase/firestore"; // Importer nødvendige funktioner fra Firebase Firestore
import FeedbackLeft from "@/components/quiz/FeedbackLeft.vue"; // Importer FeedbackLeft komponent
import FeedbackRight from "@/components/quiz/FeedbackRight.vue"; // Importer FeedbackRight komponent
import SwipeAnimation from "@/components/elements/SwipeAnimation.vue"; // Importer SwipeAnimation komponent

export default {
   name: "SwipeAdapt", // Navn på komponenten
   components: {
      FeedbackLeft,
      FeedbackRight,
      SwipeAnimation,
   },
   data() {
      return {
         questions: [], // Liste over spørgsmål
         currentQuestionIndex: 0, // Indeks for det aktuelle spørgsmål
         swipedLeft: false, // Om der er blevet swipet til venstre
         swipedRight: false, // Om der er blevet swipet til højre
         feedbackBorderClass: "", // CSS-klasse for feedback grænse
         showFeedbackLeft: false, // Om feedback for venstre swipe skal vises
         showFeedbackRight: false, // Om feedback for højre swipe skal vises
         showSwipeAnimation: false, // Om swipe animation skal vises
         currentLevel: 1, // Det aktuelle niveau
         correctAnswers: 0, // Antal korrekte svar
         incorrectAnswers: 0, // Antal forkerte svar
         totalQuestionsAnswered: 0, // Antal besvarede spørgsmål
         answeredQuestions: new Set(), // Spor besvarede spørgsmål for at undgå gentagelser
      };
   },
   computed: {
      currentQuestion() {
         return this.questions[this.currentQuestionIndex] || {}; // Returner det aktuelle spørgsmål eller en tomt objekt, hvis der ikke er flere spørgsmål
      },
   },
   async created() {
      await this.fetchQuestions(this.currentLevel); // Hent spørgsmål, når komponenten er oprettet
   },
   methods: {
      async fetchQuestions(level) {
         try {
            const q = query(collection(db, `SwipeQuestions`), where("SwipeLevel", "==", level.toString())); // Opret en forespørgsel til databasen for at hente spørgsmål på det aktuelle niveau
            const querySnapshot = await getDocs(q); // Udfør forespørgslen og vent på resultaterne
            const newQuestions = querySnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            })).filter(question => !this.answeredQuestions.has(question.id)); // Filtrer spørgsmål, der allerede er besvaret

            if (newQuestions.length > 0) {
               this.questions = newQuestions; // Opdater spørgsmålene, hvis der er nye spørgsmål
               this.currentQuestionIndex = 0; // Nulstil det aktuelle spørgsmål indeks
            } else {
               // Hvis der ikke er nye spørgsmål, hent fra det nærmeste niveau
               if (level < 5) {
                  await this.fetchQuestions(level + 1); // Hent spørgsmål fra det næste niveau
               } else if (level > 1) {
                  await this.fetchQuestions(level - 1); // Hent spørgsmål fra det forrige niveau
               }
            }
         } catch (error) {
            console.error("Error fetching questions:", error); // Log en fejl, hvis der opstår en fejl under hentning af spørgsmål
         }
      },
      async handleClick(direction) {
         if (direction === "left") {
            this.swipedLeft = true; // Angiv at der er blevet swipet til venstre
            this.showFeedbackLeft = true; // Vis feedback for venstre swipe
            this.showFeedbackRight = false; // Skjul feedback for højre swipe
            this.handleSwipe({ direction: "left" }); // Håndter venstre swipe
         } else if (direction === "right") {
            this.swipedRight = true; // Angiv at der er blevet swipet til højre
            this.showFeedbackRight = true; // Vis feedback for højre swipe
            this.showFeedbackLeft = false; // Skjul feedback for venstre swipe
            this.handleSwipe({ direction: "right" }); // Håndter højre swipe
         }
      },
      async handleKeydown(direction, event) {
         if (event.key === "Enter" || event.key === " ") {
            await this.handleClick(direction); // Håndter klik, hvis Enter eller mellemrumstasten er trykket
         }
      },
      async handleSwipe(direction) {
         const selectedAnswer = direction === "left" ? 0 : 1; // Vælg svar baseret på swipe retning
         const isCorrect = this.currentQuestion.answers[selectedAnswer].isCorrect; // Tjek om svaret er korrekt

         this.feedbackBorderClass = isCorrect ? "correct-border" : "incorrect-border"; // Sæt feedback grænse klasse baseret på korrekthed

         // Fjern klassen efter 2 sekunder
         setTimeout(() => {
            this.feedbackBorderClass = "";
         }, 2000);

         this.checkAnswer(direction); // Tjek svaret
      },
      async checkAnswer(direction) {
         const selectedAnswer = direction === "left" ? 0 : 1; // Vælg svar baseret på swipe retning
         const isCorrect = this.currentQuestion.answers[selectedAnswer].isCorrect; // Tjek om svaret er korrekt

         if (isCorrect) {
            this.correctAnswers++; // Øg antal korrekte svar
            this.incorrectAnswers = 0; // Nulstil antal forkerte svar
            if (this.currentLevel < 5) {
               this.currentLevel++; // Øg niveauet hvis muligt
            }
         } else {
            this.incorrectAnswers++; // Øg antal forkerte svar
            if (this.incorrectAnswers >= 2 && this.currentLevel > 1) {
               this.currentLevel--; // Sænk niveauet hvis der er for mange forkerte svar
               this.incorrectAnswers = 0; // Nulstil antal forkerte svar
            }
         }

         this.totalQuestionsAnswered++; // Øg antal besvarede spørgsmål
         this.answeredQuestions.add(this.currentQuestion.id); // Tilføj spørgsmålet til besvarede spørgsmål

         if (this.totalQuestionsAnswered >= 10) {
            this.endQuiz(); // Afslut quiz hvis der er besvaret 10 spørgsmål
         } else {
            await this.fetchQuestions(this.currentLevel); // Hent nye spørgsmål
         }
      },
      async nextQuestion() {
         this.swipedLeft = false; // Nulstil venstre swipe
         this.swipedRight = false; // Nulstil højre swipe
         this.showFeedbackLeft = false; // Skjul venstre feedback
         this.showFeedbackRight = false; // Skjul højre feedback

         if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++; // Gå til næste spørgsmål
         } else {
            await this.fetchQuestions(this.currentLevel); // Hent nye spørgsmål hvis der ikke er flere
         }
      },
      async endQuiz() {
         const level = this.currentLevel; // Gem det aktuelle niveau
         this.$router.push({ name: "SwipeResult", params: { level } }); // Naviger til resultat siden
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
