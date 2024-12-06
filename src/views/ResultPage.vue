<template>
  <div class="results-container">
    <h2>Quiz Completed</h2>
    <p>Congratulations! You have completed the quiz.</p>
    <button @click="goToHome">Go to Home</button>
  </div>
</template>

<script>
export default {
  name: 'ResultPage',
  methods: {
    goToHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}
</style>