<template>
    <div class="gif-modal" v-if="isVisible">
      <div class="modal-content">
        <input
          type="text"
          v-model="searchQuery"
          @input="searchGIFs"
          placeholder="Søg efter memes/GIFs"
        />
        <div class="gif-grid">
          <img
            v-for="gif in gifs"
            :src="gif.url"
            :key="gif.id"
            @click="selectGIF(gif.url)"
            class="gif-item"
          />
        </div>
  
        <!-- Tenor Attribuering -->
        <div class="tenor-credit">
          <a href="https://tenor.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://www.gstatic.com/tenor/web/attribution/PB_tenor_logo_grey_horizontal.png"
              alt="Tenor logo"
              class="tenor-logo"
            />
          </a>
        </div>
  
        <button class="close-button" @click="$emit('close')">Luk</button>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: 'GifModal',
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        searchQuery: "",
        gifs: [],
      };
    },
    methods: {
      async searchGIFs() {
        if (this.searchQuery.trim() === "") {
          this.gifs = [];
          return;
        }
        try {
          const apiKey = "AIzaSyBTpggvOFQfhpFEz891usIf-A9ou5bV5s8"; // Din Tenor API-nøgle
          const response = await axios.get(
            `https://tenor.googleapis.com/v2/search?q=${this.searchQuery}&key=${apiKey}&limit=10`
          );
          this.gifs = response.data.results.map((gif) => ({
            id: gif.id,
            url: gif.media_formats.tinygif.url, // Brug tinygif for hurtigere load
          }));
        } catch (error) {
          console.error("Fejl ved hentning af GIF'er:", error);
        }
      },
      selectGIF(url) {
        this.$emit("select", url); // Send den valgte GIF-URL tilbage til forælderen
      },
    },
  };
  </script>
  
  <style scoped>
  .gif-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: var(--text-color);
    padding: 20px;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
    text-align: center;
  }
  
  .gif-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin: 20px 0;
  }
  
  .gif-item {
    width: 100px;
    height: 100px;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.2s;
  }
  
  .gif-item:hover {
    transform: scale(1.1);
  }
  
  .tenor-credit {
    text-align: center;
    margin-top: 10px;
  }
  
  .tenor-credit a {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    font-size: 12px;
  }
  
  .tenor-logo {
    height: 20px;
    margin-right: 5px;
    vertical-align: middle;
  }
  
  .close-button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: var(--secondary-color);
    color: var(--text-color);
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  