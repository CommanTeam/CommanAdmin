<template>
  <div id= "register_course">
    <h1> 강좌를 등록하는 페이지 입니다.</h1>
    <p> 강사명 : {{currInstructorC.name}}
    </p>
    <p>강좌 검색 결과 </p>
      <nav class="vertical-menu" v-if="courseList.length > 0">
        <button v-on:click="selectCourse(course)" 
              v-for="course in courseList" 
              v-bind:key="course.id">
              {{course.title}}
        </button>
      </nav>



      <h3> 강좌를 추가해주세요 </h3>
      <form enctype="multipart/form-data" v-if="addNewCourseFormShowed">
        <label> 강사 ID </label>
        <input type='text' name='id' v-model="currInstructorC.id" disabled/>

        <label> 강좌명</label>
        <input type='text' v-model="newCourseTitle" placeholder="강좌명"/>

        <label>강좌 썸네일 이미지 업로드</label>
        <input type='file' name='courseThumbnail' 
          @change="filesChange($event.target.name, $event.target.files); 
          fileCount=$event.target.files.length" accept="image/*"/>

        <label> 무료 강의? </label>
        <input type='checkbox' v-model="newCourseIsFree"/>
        
        <label> 무료 챕터 수 </label>
        <input type='text' v-model="newCourseChapterCount" placeholder="무료 챕터 수"/>
        
        <label> 강좌 설명 </label>
        <textarea v-model="newCourseInfo"/>
        
        <label> 가격 </label>
        <input type='text' v-model="newCoursePrice" placeholder="가격 (원)"/>
        
        <label> 카테고리 목록 </label>
        <select v-model="newCourseCategoryId">
          <option v-for="category in categoryList"
                  v-bind:value="category.id"
                  v-bind:key="category.id">
            {{category.name}}
          </option>
        </select>
        
        <input type='submit' value='추가하기' v-on:click="addNewCourse"/>
      </form>
      <div>
        <button v-on:click="openNewCourseForm" >{{ addNewCourseFormShowed? '접기' : '강좌 추가하기'}}</button>
      </div>
      <chapter-list v-bind:selectedCourse="selectedCourse"></chapter-list>
      <register-chapter v-if="selectedCourse"
                        v-bind:selectedCourse="selectedCourse"
                        v-on:updateChapter="refresh"></register-chapter>
  </div>
</template>
<script>
import axios from 'axios'
import { upload } from '../service/file-upload.service'
import ChapterList from './ChapterList.vue'
import RegisterChapter from './RegisterChapter.vue'

export default {
  created () {
    this.courseExist = false
    axios.get(`/course?id=${this.currInstructorC.id}`)
      .then((res) => {
        this.courseList = res.data.courseList
      })
      .catch((err) => {
        console.log(err)
      })
  },
  components: {
    ChapterList,
    RegisterChapter
  },
  data: () => {
    return {
      courseList: [],
      newCourseTitle: '',
      newCourseIsFree: false,
      newCourseChapterCount: 0,
      newCourseInfo: '',
      newCoursePrice: 0,
      newCourseCategoryId: 1,
      categoryList: [
        {id: 1, name: '컴퓨터'},
        {id: 2, name: '모바일'},
        {id: 3, name: '문서'},
        {id: 4, name: '인터넷'},
        {id: 5, name: '프로그래밍'},
        {id: 6, name: '디자인'},
        {id: 7, name: '황혼 프로젝트'}
      ],
      formData: new FormData(),
      addNewCourseFormShowed: false,
      selectedCourse: null
    }
  },
  methods: {
    selectCourse (course) {
      this.selectedCourse = course
    },
    addNewCourse () {
      this.formData.append('supplierID', this.currInstructor.id)
      this.formData.append('title', this.newCourseTitle)
      this.formData.append('isFree', this.newCourseIsFree)
      this.formData.append('chapterCount', this.newCourseChapterCount)
      this.formData.append('courseInfo', this.newCourseInfo)
      this.formData.append('coursePrice', this.newCoursePrice)
      this.formData.append('categoryID', this.newCourseCategoryId)
      upload(this.formData, `/course/register`)
        .then(x => {
          alert('강좌 추가를 완료하였습니다.')
          this.addNewCourseFormShowed = false
        })
        .catch(err => {
          console.log(err)
        })
      this.formData = new FormData()
    },
    filesChange (fieldName, fileList) {
      if (!fileList.length) return
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          this.formData.append(fieldName, fileList[x], fileList[x].name)
        })
    },
    openNewCourseForm () {
      this.addNewCourseFormShowed = !this.addNewCourseFormShowed
    },
    refresh () {
      this.$emit('refresh')
    }
  },
  props: ['currInstructorC'],
  watch: {
    currInstructorC (instructor) {
      axios.get(`/course?id=${this.currInstructorC.id}`)
        .then((res) => {
          this.courseList = res.data.courseList
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>