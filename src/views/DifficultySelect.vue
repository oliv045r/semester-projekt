<!-- src/components/Home.vue -->
<template>
  <div>
    <div class="dif-intro">
      <h2>Vælg spiltype og niveau</h2>
      <p>Lås op for flere niveauer i takt med at du spiller!</p>
    </div>
    <div class="quiz-container">
      <h3 class ="swipe-header">To valg, et swipe</h3>
      <p>I denne spiltype skal du swipe dig til det rigtige svar blandt to valgmuligheder</p>
      <div class="btn-container quiz-swipe">
        <router-link v-for="level in 5" :key="'swipe-' + level" :to="{ name: 'Swipe', params: { level } }">
          <button :class="['difficulty-btn', { 'swipe-active': level <= maxSwipeLevel }]">{{ level }}</button>
        </router-link>
      </div>
    </div>
    <div class="quiz-container">
      <h3 class="quiz-header">Quiz dig selv</h3>
      <p>Har du lært noget af at swipe? Test hvor meget du kan huske!</p>
      <div class="btn-container quiz-swipe">
        <router-link v-for="level in 5" :key="'quiz-' + level" :to="{ name: 'Quiz', params: { level } }">
          <button :class="['difficulty-btn', { 'quiz-active': level <= maxQuizLevel }]">{{ level }}</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default {
  name: 'DifficultySelect',
  data() {
    return {
      maxSwipeLevel: 1,
      maxQuizLevel: 0,
    };
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, `users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      this.maxSwipeLevel = userData.maxSwipeLevel || 1;
      this.maxQuizLevel = userData.maxQuizLevel || 0;
    }
  }
};
</script>

<style scoped>
.btn-container {
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-self: center;
}

.dif-intro {
  text-align: left; /* Venstrejuster introsektionen */
  margin: 0 2rem; /* Tilføj lidt margin for en bedre visning */
}

.quiz-container {
  margin-top: 4rem;
  text-align: left; /* Venstrejuster tekst */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Sørg for, at teksten forbliver venstrecentreret */
  padding: 0 2rem; /* Tilføj lidt indrykning til teksten */
}

.swipe-guide {
  width: 50%;
  margin: 3rem auto 0 auto;
}

.swipe-header {
  color: var(--secondary-color);
}

.quiz-header {
  color: var(--main-color);
}

h2{
  color: var(--secondary-color);
}

.quiz-container h3,
.quiz-container p {
  text-align: left; /* Venstrejuster overskrifter og beskrivelser */
}

.difficulty-btn {
  padding: 0.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 7px;
  border: none;
  font-size: 20px;
  font-weight: 600;
  background-color: #949494;
}

.swipe-active {
  background-color: var(--secondary-color);
}

.quiz-active {
  background-color: var(--main-color);
}
</style>