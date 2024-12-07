<template>
  <div class="feedback-container" :class="{ visible: isVisible }">
    <img class="feed-img" src="@/assets/images-feedback/giphy.gif" alt="">
    <h2 class="feed-heading">{{ feedbackHeading }}</h2>
    <p class="feed-subheading"><strong>Vidste du at</strong></p>
    <p class="feed-desc">{{ feedbackDesc }}</p>
    <span class="shadow-parent"><button class="feed-right-btn" @click="$emit('next')">Næste</button></span>
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

.feed-desc, .feed-subheading {
margin: 1rem 2rem;    
text-align: left;
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
  color: #fff; /* White text */
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
</style>