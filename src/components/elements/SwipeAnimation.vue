<template>
  <div
    v-if="isVisible"
    class="swipe-animation"
    :class="{ hidden: isFadingOut }"
  >
    <img
      src="@/assets/icons/swipe.png"
      alt="Swipe animation"
      class="swipe-icon"
      :class="{
        animateRight: direction === 'right' && isAnimating,
        animateLeft: direction === 'left' && isAnimating
      }"
    />
  </div>
</template>

<script>
export default {
  name: "SwipeAnimation",
  props: {
    isVisible: {
      type: Boolean,
      default: true, // Styr synligheden af animationen
    },
    autoFadeOut: {
      type: Boolean,
      default: false, // Om animationen skal fade ud automatisk
    },
    startDirection: {
      type: String,
      default: "right", // Standardretning for animationen
    },
  },
  data() {
    return {
      isAnimating: false,
      direction: this.startDirection,
      isFadingOut: false,
    };
  },
  mounted() {
    this.animateOnce(); // Start første animation
    this.startAnimation(); // Start gentagende animation
    if (this.autoFadeOut) {
      this.fadeOut(); // Start automatisk fade-out, hvis aktiveret
    }
  },
  methods: {
    animateOnce() {
      this.isAnimating = true;
      setTimeout(() => {
        this.isAnimating = false;
        this.direction = "left"; // Skift retning
      }, 1000);
    },
    startAnimation() {
      setInterval(() => {
        this.isAnimating = true;
        setTimeout(() => {
          this.isAnimating = false;
          this.direction = this.direction === "right" ? "left" : "right";
        }, 1000);
      }, 2000);
    },
    fadeOut() {
      this.isFadingOut = true;
      setTimeout(() => {
        this.isFadingOut = false;
        this.$emit("hide"); // Emit event til forælder, når fade-out er færdig
      }, 1000);
    },
  },
};
</script>

<style scoped>
.swipe-animation {
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 1; /* Synlig som standard */
  transition: opacity 1s ease; /* Glidende overgang til fade-out */
}

.swipe-icon {
  width: 80px; /* Juster størrelsen */
  height: auto;
  transition: transform 1s ease; /* Glidende animation */
}

.swipe-icon.animateRight {
  transform: translateX(40px); /* Bevæg til højre */
}

.swipe-icon.animateLeft {
  transform: translateX(-40px); /* Bevæg til venstre */
}

.hidden {
  opacity: 0; /* Fade ud */
}
</style>
