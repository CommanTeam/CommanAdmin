<template>
  <div id = "wrapper">
    <div id = "container">
      <p v-bind:key="currInstructor.id">
        현재 강사: {{currInstructor.name}}
      </p>
      <p v-if="!instructorSelected"> 강사 목록</p>
      <nav class="vertical-menu" v-if="!instructorSelected">
        <button v-on:click="selectInstructor(instructor)" 
                v-for="instructor in instructorList" 
                v-bind:key="instructor.id">
                {{instructor.name}}
        </button>
      </nav>
      <button v-on:click="showList()"
              v-if="instructorSelected">다시 고르기</button>
      <div v-if="instructorSelected">
        <header-bar></header-bar>
        <router-view v-bind:currInstructor="currInstructor"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import RegisterCourse from './RegisterCourse.vue'
import RegisterInstructor from './RegisterInstructor.vue'
import headerBar from './headerBar.vue'

export default {
  components: {
    headerBar,
    RegisterCourse,
    RegisterInstructor
  },
  created () {
    axios.get(`/instructors`)
      .then((res) => {
        this.statusText = res.statusText
        this.instructorList = res.data.data
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      instructorList: [],
      currInstructor: {name: '미정', id: 0},
      instructorSelected: false
    }
  },
  methods: {
    selectInstructor (instructor) {
      this.currInstructor = instructor
      this.instructorSelected = true
    },
    showList () {
      this.instructorSelected = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.vertical-menu {
  margin-bottom: 50px;
}

.vertical-menu button {
    background-color: #eee; /* Grey background color */
    color: black; /* Black text color */
    display: block; /* Make the links appear below each other */
    padding: 6px; /* Add some padding */
    text-decoration: none; /* Remove underline from links */
    align-self: center;
    width: 100%; /* Set a width if you like */
}

.vertical-menu button:hover {
    background-color: #ccc; /* Dark grey background on mouse-over */
}

.vertical-menu button.active {
    background-color: #4CAF50; /* Add a green color to the "active/current" link */
    color: white;
}

nav {
  overflow: scroll;
  height: 150px;
}

textarea {
    width: 100%;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 5em;
    resize: vertical;
}

input[type=text], select {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

input[type=button], button {
    width: 100%;
    background-color: #4777d9;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

input[type=submit]:hover {
    background-color: #0033b1;
}

label {
  text-align: left;
  display: block;
  padding: 0.5em 1.5em 0.5em 0;
}

div {
    border-radius: 5px;
    padding: 20px;
}

body {
    background-color: #f2f2f2;
}

.list-elem {
  border: 2px solid gray;
  border-radius: 5px;
}
</style>
