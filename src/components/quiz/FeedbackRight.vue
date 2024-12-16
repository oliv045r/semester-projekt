<template>
  <div class="feedback-container" :class="{ visible: isVisible }">
    <!-- Dynamisk GIF -->
    <img 
      class="feed-img" 
      :src="gifUrl || '@/assets/images-feedback/caught-in.gif'" 
      alt="Feedback GIF"
    >

    <!-- Tenor Kreditering -->
    <div class="tenor-credit" v-if="gifUrl">
      <a href="https://tenor.com" target="_blank" rel="noopener noreferrer">
        <img 
          src="https://www.gstatic.com/tenor/web/attribution/PB_tenor_logo_grey_horizontal.png" 
          alt="Tenor logo" 
          class="tenor-logo"
        />
      </a>
    </div>

    <h2 class="feed-heading">{{ feedbackHeading }}</h2>
    <p>Vidste du at:</p>
    <p class="feed-desc">{{ feedbackDesc }}</p>
    <span class="shadow-parent">
      <button class="feed-right-btn" @click="$emit('next')">Næste</button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'FeedbackRight',
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
    }
  }
};
</script>

<style scoped>
.feedback-container {
  position: absolute;
  top: 0;
  right: 100%;
  width: 100%;
  height: 100%;
  background-color: var(--secondary-color);
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Alt venstrecentreret */
  justify-content: center;
  text-align: left; /* Tekst venstrejusteret */
  transition: transform 0.3s ease;
}

.feedback-container.visible {
  transform: translateX(100%);
}

.feed-img {
  width: calc(100% - 4rem);
  border-radius: 15px;
  align-self: center; /* Hold GIF'en centreret */
}

.feed-heading {
  margin: 1rem 2rem;
  text-align: left; /* Venstrejuster */
  align-self: flex-start; /* Sørg for, at overskriften også er venstrecentreret */
}

.feed-desc {
  margin: 1rem 2rem;
  text-align: left; /* Venstrejuster */
  align-self: flex-start; /* Venstrecentrer */
}

.feed-right-btn {
  width: 100%;
  display: inline-block;
  background-color: var(--main-color);
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 10px 35px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: none;
  font-family: Poppins;
  clip-path: polygon(0% 0, 93% 0, 100% 50%, 93% 100%, 00% 100%, 0 50%);
  filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
  align-self: flex-start; /* Venstrecentrer knappen */
}

.shadow-parent {
  position: absolute;
  bottom: 2rem;
  align-self: flex-start; /* Venstrecentrer */
  left: 0;
  width: 42%;
  filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
}

.feedback-container p:first-of-type {
  text-align: left; /* Sørg for, at "Vidste du at" venstrejusteres */
  margin: 0rem 2rem;
  align-self: flex-start; /* Venstrecentrer "Vidste du at" */
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