<template>
  <div class="feedback-container" :class="{ visible: isVisible }">
    <!-- Dynamisk GIF -->
    <img class="feed-img" :src="gifUrl || require('@/assets/images-feedback/giphy.gif')" alt="Feedback GIF" />
    
    <!-- Tenor kreditering -->
    <div class="tenor-credit" v-if="gifUrl">
      <a href="https://tenor.com" target="_blank" rel="noopener noreferrer">
        <img
          src="https://www.gstatic.com/tenor/web/attribution/via_tenor_logo_grey.png"
          alt="Tenor logo"
          class="tenor-logo"
        />
      </a>
    </div>
    
    <h2 class="feed-heading">{{ feedbackHeading }}</h2>
    <p class="feed-subheading"><strong>Vidste du at:</strong></p>
    <p class="feed-desc">{{ feedbackDesc }}</p>
    <span class="shadow-parent">
      <button class="feed-right-btn" @click="$emit('next')">Næste</button>
    </span>
  </div>
</template>

<script>
export default {
  name: "FeedbackLeft",
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    feedbackHeading: {
      type: String,
      required: true,
    },
    feedbackDesc: {
      type: String,
      required: true,
    },
    gifUrl: {
      type: String,
      default: null, // Standardværdi, hvis ingen GIF-URL er angivet
    },
  },
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

.tenor-credit {
  margin: 10px 0;
  text-align: center;
}
.tenor-credit img.tenor-logo {
  width: 70px;
  display: inline-block;
}
.tenor-credit a {
  text-decoration: none;
  color: #ffffff;
  font-size: 14px;
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
  background-color: var(--secondary-color);
  color: #fff;
  font-size: 18px;
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
  text-align: left;
  margin: 0rem 2rem;
  align-self: flex-start;
  font-weight: semibold;
}
</style>
