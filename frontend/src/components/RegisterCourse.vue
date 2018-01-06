<template>
  <div id= "register_course">
    <h1> 강좌를 등록하는 페이지 입니다.</h1>
    <p> 강사명 : {{currInstructor.name}}
    </p>
    <p>강좌 검색 결과 </p>
      <nav class="vertical-menu" v-if="courseExist">
        <button v-on:click="getRegisteredChapter()" 
                v-for="course in courseList" 
                v-bind:key="course.id">
                {{course.title}}
        </button>
      </nav>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  created () {
    this.courseExist = false
    axios.get(`/register_course?id=${this.currInstructor.id}`)
      .then((res) => {
        this.courseList = res.data.courseList
        this.courseExist = true
      })
      .catch((err) => {
        console.log(err)
      })
  },
  name: 'RegisterCourse',
  data: () => {
    return {
      courseList: [],
      courseExist: false
    }
  },
  methods: {
    getRegisteredChapter: () => {
      axios.get(`/register_course?${name}`)
        .then((res) => {
          this.courseList = res.courseList
          this.courseExist = true
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  props: ['currInstructor'],
  watch: {
    currInstructor (instructor) {
      console.log(instructor)
      this.currInstructor = instructor
      axios.get(`/register_course?id=${this.currInstructor.id}`)
        .then((res) => {
          this.courseList = res.data.courseList
          this.courseExist = false
          this.courseExist = true
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style>
</style>