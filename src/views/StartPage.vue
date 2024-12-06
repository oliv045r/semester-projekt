<!-- src/components/Home.vue -->
<template>
  <div>
    <img src="@/assets/icons/SmartChoice.svg" alt="">
    <p>Kan du swipe dig til det grønne valg?</p>
    <div class="btn-container">
      <router-link to="/opret-bruger">
        <PrimaryButton>Opret Bruger</PrimaryButton>
      </router-link>
      <router-link to="/log-ind">
        <PrimaryButton class="secondary-bg-color">Log ind</PrimaryButton>
      </router-link>
    </div>
  </div>
</template>

<script>
import PrimaryButton from '@/components/elements/PrimaryButton.vue';

export default {
  name: 'StartPage',
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
</style>