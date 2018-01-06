<template>
  <div id="app">
    <h1>관리자 페이지 입니다.</h1>
    <main-container class ="main-container"></main-container>
  </div>
</template>

<script>
import MainContainer from './components/MainContainer.vue'
export default {
  name: 'app',
  components: {
    MainContainer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.main-container {
  margin-bottom: 200px;
}
</style>
