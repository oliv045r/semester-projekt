<!-- src/components/Home.vue -->
<template>
  <div>
    <div class="dif-intro">
      <h2>Vælg spiltype og niveau</h2>
      <p>Lås op for flere niveauer i takt med at du spiller!</p>
    </div>
    <div class="quiz-container">
      <h3>To valg, et swipe</h3>
      <p>I denne spiltype skal du swipe dig til det rigtige svar blandt to valgmuligheder</p>
      <div class="btn-container quiz-swipe">
        <router-link :to="{ name: 'Swipe', params: { level: 1 } }">
          <button class="difficulty-btn dif-active">1</button>
        </router-link>
        <router-link :to="{ name: 'Swipe', params: { level: 2 } }">
          <button class="difficulty-btn">2</button>
        </router-link>
        <router-link :to="{ name: 'Swipe', params: { level: 3 } }">
          <button class="difficulty-btn">3</button>
        </router-link>
        <router-link :to="{ name: 'Swipe', params: { level: 4 } }">
          <button class="difficulty-btn">4</button>
        </router-link>
        <router-link :to="{ name: 'Swipe', params: { level: 5 } }">
          <button class="difficulty-btn">5</button>
        </router-link>
      </div>
    </div>
    <div class="quiz-container">
      <h3>Quiz dig selv</h3>
      <p>Har du lært noget af at swipe? Test hvor meget du kan huske!</p>
      <div class="btn-container quiz-swipe">
        <router-link :to="{ name: 'Quiz', params: { level: 1 } }">
          <button class="difficulty-btn dif-active">1</button>
        </router-link>
        <router-link :to="{ name: 'Quiz', params: { level: 2 } }">
          <button class="difficulty-btn">2</button>
        </router-link>
        <router-link :to="{ name: 'Quiz', params: { level: 3 } }">
          <button class="difficulty-btn">3</button>
        </router-link>
        <router-link :to="{ name: 'Quiz', params: { level: 4 } }">
          <button class="difficulty-btn">4</button>
        </router-link>
        <router-link :to="{ name: 'Quiz', params: { level: 5 } }">
          <button class="difficulty-btn">5</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DifficultySelect',
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

.quiz-container {
  margin-top: 4rem;
}

.swipe-guide {
  width: 50%;
  margin: 3rem auto 0 auto;
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

.quiz-swipe .dif-active {
  background-color: var(--secondary-color);
}
</style>