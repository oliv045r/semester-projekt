<template>
  <NavHeader></NavHeader>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import NavHeader from './components/elements/NavHeader.vue';


export default {
  name: 'App',
  components: {
    NavHeader,
  }
}
</script>

<style>

#app {
  overflow: hidden;
  width: 100vw;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;}
</style>
