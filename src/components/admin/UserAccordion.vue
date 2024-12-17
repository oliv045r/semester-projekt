<template>
  <div class="accordion-item">
    <div class="accordion-header" @click="toggleAccordion(index)">
      <h3>{{ user.username }}</h3>
      <span>{{ isActive ? '-' : '+' }}</span>
    </div>
    <div v-if="isActive" class="accordion-content">
      <p><strong>Bruger id:</strong> {{ user.userId }}</p>
      <p><strong>Swipe Niveau:</strong> {{ user.maxSwipeLevel || 'N/A' }}</p>
      <p><strong>Quiz Niveau:</strong> {{ user.maxQuizLevel || 'N/A' }}</p>
      <button @click="resetProgress(user.userId)">Nulstil score</button>
      <button @click="deleteUser(user.userId)">Slet bruger</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAccordion',
  props: {
    user: Object,
    index: Number,
    isActive: Boolean,
    toggleAccordion: Function,
    resetProgress: Function,
    deleteUser: Function
  }
}
</script>

<style scoped>


.accordion-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: var(--main-color);
    color: var(--text-color);
    border-radius: 25px;
    margin-bottom: 10px;
    padding: 10px 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    width: 90%;
    animation: fade-in 0.5s ease-out forwards; /* Fade-in animation */
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  cursor: pointer;
  color: var(--text-color);
  width: 100%;

}

.accordion-content {
  padding-bottom: 0.5rem;
  color: var(--text-color);
  justify-content: start;
}

.accordion-content p {
text-align: left;
}

button {
  padding: 10px 20px;
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: none;
  cursor: pointer;
  margin-right: 10px;
  border-radius: 7px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: var(--secondary-color);
}

</style>