<template>
  <div class="button-container">
    <button class="retry-button" @click="$emit('retry')">Vælg niveau</button>
    <button class="next-button" @click="$emit('next')">Videre</button>
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

.retry-button,
.next-button {
  display: inline-block;
  width: 49%;
  padding: 15px 0;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
}

.retry-button {
  background-color: #0056a6;
  clip-path: polygon(0% 0, 93% 0, 100% 50%, 93% 100%, 0% 100%, 0% 50%);
}

.retry-button:hover {
  background-color: #003d7a;
}

.next-button {
  background-color: #f35d0c;
  clip-path: polygon(100% 0, 7% 0, 0 50%, 7% 100%, 100% 100%, 100% 50%);
}

.next-button:hover {
  background-color: #c2470a;
}
</style>
