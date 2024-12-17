<template>
  <div class="button-container">
    <!-- Retry Button -->
    <div class="shadow-parent">
      <button class="retry-button" @click="$emit('retry')">Vælg niveau</button>
    </div>

    <!-- Next Button -->
    <div class="shadow-parent">
      <button class="next-button" @click="$emit('next')">Videre</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NextButtons",
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 0;
}

.shadow-parent {
  position: relative;
  width: 49%; /* Matcher knappens bredde */
  display: flex; /* Centrer knappen inden i wrapperen */
  justify-content: center;
  filter: drop-shadow(-1px 6px 4px rgba(0, 0, 0, 0.5)); /* Skygge */
}

.retry-button,
.next-button {
  display: inline-block;
  width: 100%; /* Fyld wrapperens bredde */
  padding: 15px 0;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

/* Retry Button */
.retry-button {
  background-color: var(--main-color);
  clip-path: polygon(0% 0, 93% 0, 100% 50%, 93% 100%, 0% 100%, 0% 50%);
  color: var(--text-color);
}

.retry-button:hover {
  background-color: var(--hover-main-color);
  transform: translateY(-2px); /* Løft knappen lidt */
  color: var(--text-color);
}

/* Next Button */
.next-button {
  background-color: var(--secondary-color);
  clip-path: polygon(100% 0, 7% 0, 0 50%, 7% 100%, 100% 100%, 100% 50%);
  color: var(--text-color);
}

.next-button:hover {
  background-color: var(hover-secondary-color);
  transform: translateY(-2px); /* Løft knappen lidt */
  color: var(--text-color);
}
</style>
