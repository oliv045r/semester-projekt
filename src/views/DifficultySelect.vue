<!-- src/components/Home.vue -->
<template>
  <div>
    <p>Vælg spiltype/sværhedsgrad</p>
    <img class="swipe-guide" src="@/assets/icons/Swipe-guide.svg" alt="swipe guide for navigation">
    <div class="btn-container">
      <router-link to="/quiz">
        <PrimaryButton class="split-bg-color">50 / 50 - Let</PrimaryButton>
      </router-link>
      <router-link to="#">
        <PrimaryButton class="split-bg-color">50 / 50 - Svær</PrimaryButton>
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
    margin-top: 5rem;
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