<!-- src/components/Home.vue -->
<template>
  <div>
    <img src="@/assets/icons/SmartChoice.svg" alt="">
    <p>Kan du swipe dig til det grønne valg?</p>
    <div class="btn-container">
      <router-link tabindex="1" to="/opret-bruger" aria-label="Opret Bruger">
        <PrimaryButton>Opret Bruger</PrimaryButton>
      </router-link>
      <router-link tabindex="2" to="/log-ind" aria-label="Log ind">
        <PrimaryButton :secondary="true">Log ind</PrimaryButton>
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
    margin-left: auto;
    margin-right: auto;
  }
</style>