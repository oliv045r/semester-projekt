<template>
  <div class="feedback-container" :class="{ visible: isVisible }">
    <!-- Dynamisk GIF-url med fallback -->
    <img
      tabindex="-1"
      class="feed-img"
      :src="gifUrl || '@/assets/images-feedback/giphy.gif'"
      :alt="gifAlt || 'Feedback GIF'"
    >

    <div tabindex="-1" class="tenor-credit" v-if="gifUrl">
      <a tabindex="-1" href="https://tenor.com" target="_blank" rel="noopener noreferrer">
        <img 
          tabindex="-1"
          src="https://www.gstatic.com/tenor/web/attribution/PB_tenor_logo_grey_horizontal.png" 
          alt="Tenor logo" 
          class="tenor-logo"
        />
      </a>
    </div>
    
    <h2 class="feed-heading" :aria-label="`Feedback heading: ${feedbackHeading}`">{{ feedbackHeading }}</h2>
    <p class="feed-subheading" aria-label="Did you know"><strong>Vidste du at:</strong></p>
    <p class="feed-desc" :aria-label="`Feedback description: ${feedbackDesc}`">{{ feedbackDesc }}</p>
    <span class="shadow-parent">
      <button class="feed-right-btn" @click="$emit('next')" aria-label="Next">Næste</button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'FeedbackLeft',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    feedbackHeading: {
      type: String,
      required: true
    },
    feedbackDesc: {
      type: String,
      required: true
    },
    gifUrl: {
      type: String,
      default: null
    },
    gifAlt: { // Ny prop til ALT-tag
      type: String,
      default: 'Feedback GIF'
    }
  }
};
</script>

<style scoped>
.feedback-container {
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  background-color: var(--main-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}
.feedback-container.visible {
  transform: translateX(-100%);
}

.feed-img {
  width: calc(100% - 4rem);
  border-radius: 15px;
}

.feed-desc,
.feed-subheading {
  margin: 1rem 2rem;    
  text-align: left !important;
}

.feed-heading {
  justify-self: flex-start;
  align-self: flex-start;
  margin: 1rem 2rem;
  text-align: left;
}

.feed-right-btn {
  width: 100%;
  display: inline-block;
  background-color: var(--secondary-color); /* Blue color */
  color: var(--text-color); /* White color */
  font-size: 18px; /* Adjust as needed */
  font-weight: bold;
  text-align: center;
  padding: 10px 35px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  font-family: Poppins;
  clip-path: polygon(7% 0, 100% 0, 100% 50%, 100% 100%, 7% 100%, 0 50%);
  filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));

}

.shadow-parent {
  position: absolute;
  bottom: 2rem;
  justify-self: flex-end;
  align-self: flex-start;
  right: 0;
  width: 42%;
  filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
}

.feedback-container p:first-of-type {
  text-align: left; /* Venstrejuster "Vidste du at" */
  margin: 0rem 2rem;
  align-self: flex-start; /* Venstrecentrer teksten */
  font-weight: semibold;
}

.tenor-credit {
  margin-top: 0.5rem;
  text-align: center;
  width: 90%; /* Sørg for, at det tilpasser sig containeren */
}

.tenor-credit a {
  display: inline-block;
  text-decoration: none;
}

.tenor-logo {
  height: 20px;
  vertical-align: middle;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.tenor-logo:hover {
  opacity: 1;
}
</style>
