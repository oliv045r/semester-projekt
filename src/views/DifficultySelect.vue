<!-- src/components/Home.vue -->
<template>
  <div>
    <p>Vælg spiltype/sværhedsgrad</p>
    <img class="swipe-guide" src="@/assets/icons/Swipe-guide.svg" alt="swipe guide for navigation">
    <p>50/50</p>
    <div class="btn-container quiz-swipe">
      <router-link :to="{ name: 'Quiz', params: { quizId: 'quiz1', level: 1 } }">
        <PrimaryButton class="split-bg-color">1</PrimaryButton>
      </router-link>
    </div>
    <p>Quiz</p>
    <div class="btn-container quiz-quiz">
      <router-link :to="{ name: 'Quiz', params: { quizId: 'quiz2', level: 1 } }">
        <PrimaryButton class="split-bg-color">1</PrimaryButton>
      </router-link>
    </div>
  </div>
</template>

<script>
import PrimaryButton from '@/components/elements/PrimaryButton.vue';

export default {
  name: 'HomePage',
  components: {
    PrimaryButton
  }
}
</script>

<style scoped>
  .btn-container {
    margin-top: 0rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 60vw;
    justify-self: center;
  }

  .swipe-guide {
    width: 50%;
    margin: 3rem auto 0 auto;
  }
</style>