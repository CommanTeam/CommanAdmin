<template>
  <div id="wrapper">
    <ul>
      <li><router-link to="/register_instructor">강사 등록하기</router-link></li>
      <li><router-link to="/course">강좌 등록하기</router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
}
</script>
<style scoped>
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #4777d9;
}

li {
    float: left;
}

li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

/* Change the link color to #111 (black) on hover */
li a:hover {
    background-color: #888;
}
</style>
