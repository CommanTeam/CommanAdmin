<template>
    <div id = "register_instructor">
    <h1> {{title}} </h1>
    <h3> {{message}} </h3>
    <form action = 'register_instructor' method="POST" enctype="multipart/form-data" id="registerForm">
        <div class= "wrapper">
            <p>
                강사명
            </p>
            <p>
                <input type='text' name='name' placeholder="강사명"/>
            </p>
            <p>
                이미지 파일 업로드
            </p>
            <p>
                <input type='file' name='instructorProfile'/>
            </p>
            <p>
                <input type='submit' value='등록하기' id="submitBtn"/>
            </p>
        </div>
    </form>
    </div>
</template>
<script>
export default {
  created () {
  },
  name: 'RegisterInstructor',
  data () {
    return {
      title: '강사 설정하는 페이지 입니다.',
      message: this.statusText,
      instructorList: []
    }
  },
  methods: {
    fetchData () {
    },
    selectInstructor () {
      console.log('hi')
    }
  },
  watch: {
    '$route': 'fetchData'
  }
}
</script>
<style>
</style>
