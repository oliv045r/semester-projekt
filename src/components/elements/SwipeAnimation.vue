<template>
    <div class="swipe-animation">
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
    data() {
      return {
        isAnimating: false, // Styr animationstilstanden
        direction: "right", // Start med at animere til højre
        isFadingOut: false, // Tilføj fade-out kontrol
      };
    },
    mounted() {
      this.animateOnce(); // Start animation med det samme
      this.startAnimation(); // Start intervallet for gentagne animationer
    },
    methods: {
      animateOnce() {
        this.isAnimating = true; // Start animation
        setTimeout(() => {
          this.isAnimating = false; // Stop animation efter 1 sekund
          this.direction = "left"; // Skift retning efter første animation
        }, 1000); // Varighed af animation (1 sekund)
      },
      startAnimation() {
        setInterval(() => {
          this.isAnimating = true; // Start animation
          setTimeout(() => {
            this.isAnimating = false; // Stop animation
            this.direction = this.direction === "right" ? "left" : "right"; // Skift retning
          }, 1000); // Varighed af animation (1 sekund)
        }, 2000); // Interval mellem animationer (2 sekunder)
      },
      fadeOut() {
        this.isFadingOut = true; // Start fade-out
        setTimeout(() => {
          this.isFadingOut = false; // Stop fade-out (valgfrit, hvis du ønsker at nulstille)
          this.$emit("hide"); // Emit event til forælderen for at skjule komponenten
        }, 1000); // Match CSS-transition varighed
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
  