<template>
    <div id = "register_instructor">
      <h1> 강사 설정하는 페이지 입니다.</h1>
      <label>강사명</label>
      <input type='text' v-model="newInstructorName"/>
      <ul>
        <li v-for="(file, index) in pictureFiles" :key="file.id">
          <span>{{file.name}}</span> -
          <span>{{file.size}}</span> -
          <span v-if="file.error">{{file.error}}</span>
          <span v-else-if="file.success">success</span>
          <span v-else-if="file.active">active</span>
          <span v-else-if="file.active">active</span>
          <span v-else></span>
        </li>
      </ul>
      <file-upload
        class="btn"
        post-action="/upload/post"
        extensions="gif,jpg,jpeg,png,webp"
        accept="image/png,image/gif,image/jpeg,image/webp"
        :multiple="true"
        :size="1024 * 1024 * 10"
        v-model="pictureFiles"
        @input-filter="inputFilter"
        @input-file="inputFile"
        ref="upload">
        이미지 파일 업로드
      </file-upload>
      <button type="button" v-on:click="uploadInstructor">업로드 하기</button>
    </div>
</template>
<script>

import FileUpload from 'vue-upload-component'
import { upload } from '../service/file-upload.service'
export default {
  components: {
    FileUpload
  },
  data () {
    return {
      newInstructorName: null,
      pictureFiles: []
    }
  },
  methods: {
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前
        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
    },
    inputFile (newFile, oldFile) {
      if (newFile && !oldFile) {
        // add
        console.log('add', newFile)
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile)
      }
      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile)
      }
    },
    uploadInstructor () {
      var formData = new FormData()
      formData.append('name', this.newInstructorName)
      formData.append('instructorProfile',
        this.pictureFiles[0].file,
        this.pictureFiles[0].name)
      upload(formData, `/instructor`)
        .then(x => {
          alert('강사 추가를 완료하였습니다.')
          this.$emit('refresh')
          this.pictureFiles = []
          this.newInstructorName = null
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
