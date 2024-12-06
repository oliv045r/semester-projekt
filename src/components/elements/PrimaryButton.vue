<template>
    <button class="primary-button">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'PrimaryButton'
}
</script>

<style scoped>
.primary-button {
    width: 100%;
    display: inline-block;
  background-color: var(--main-color); /* Blue color */
  color: #fff; /* White text */
  font-size: 16px; /* Adjust as needed */
  font-weight: bold;
  text-align: center;
  padding: 16px 52px;
  border-radius: 4px;
  clip-path: polygon(10% 0, 90% 0, 100% 50%, 90% 100%, 10% 100%, 0 50%);
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  font-family: Poppins;
}

.primary-button:hover {
    background-color: #2c80b4; /* Darker blue on hover */
}
</style>