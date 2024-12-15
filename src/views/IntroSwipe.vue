<template>
    <div class="intro-container">
      <div class="swipe-area">
        <div
          class="start-area right"
          v-gesture="handleSwipe"
          :class="{ swiped: swipedRight }"
        >
          Swipe til højre for at starte!
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "IntroSwipe",
    data() {
      return {
        touchStartX: 0,
        touchEndX: 0,
        swipedRight: false,
      };
    },
    methods: {
      handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
      },
      handleTouchEnd(event) {
        this.touchEndX = event.changedTouches[0].clientX;
        this.detectSwipe();
      },
      detectSwipe() {
        const swipeDistance = this.touchEndX - this.touchStartX;
        if (swipeDistance > 50) {
          // Swipe til højre
          this.swipedRight = true;
          this.startGame();
        }
      },
      startGame() {
        this.$router.push({ name: "SwipeGame", params: { level: 1 } });
      },
    },
  };
  </script>
  
  
  <style scoped>
  .intro-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f5f5f5;
    padding: 20px;
    text-align: center;
  }
  
  .swipe-area {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  
  .start-area {
    width: 85%;
    padding: 30px;
    text-align: center;
    font-size: 22px;
    background-color: var(--main-color);
    color: #fff;
    clip-path: polygon(0% 0, 90% 0, 100% 50%, 90% 100%, 0% 100%, -10% 50%);
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  
  .start-area.right {
    margin-top: 1rem;
    align-self: center;
  }
  
  .start-area.swiped {
    transform: translateX(100%);
  }
  </style>
  