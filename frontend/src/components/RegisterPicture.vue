<<template>
  <div>
    <label>강의 명</label>
    <input type='text' v-model="lectureTitle"/>
    <label>강의 설명</label>
    <input type='text' v-model="lectureInfo"/>
    <label>강의 순서</label>
    <input type="text" v-model="lecturePriority"/>
    <div class="upload">
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
      <div class="example-btn">
        <file-upload
          class="btn btn-primary"
          post-action="/upload/post"
          extensions="gif,jpg,jpeg,png,webp"
          accept="image/png,image/gif,image/jpeg,image/webp"
          :multiple="true"
          :size="1024 * 1024 * 10"
          v-model="pictureFiles"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload">
          이미지 파일 찾기
        </file-upload>
        <button type="button" v-on:click="updateLecture">업로드 하기</button>
      </div>
    </div>
  </div>  
</template>
<style>
.example-simple label.btn {
  margin-bottom: 0;
  margin-right: 1rem;
}
</style>
<script>

import FileUpload from 'vue-upload-component'
import { upload } from '../service/file-upload.service'
export default {
  components: {
    FileUpload
  },
  data () {
    return {
      lectureTitle: null,
      lectureInfo: null,
      lectureType: 1,
      lecturePriority: 0,
      picturePriority: null,
      pictureFiles: []
    }
  },
  props: ['chapterId'],
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
    updateLecture () {
      var formData = new FormData()
      formData.append('title', this.lectureTitle)
      formData.append('info', this.lectureInfo)
      formData.append('priority', this.lecturePriority)
      formData.append('type', this.lectureType)
      for (var idx in this.pictureFiles) {
        formData.append('quizPicture', this.pictureFiles[idx].file, this.pictureFiles[idx].name)
      }
      formData.append('chapterId', this.chapterId)
      upload(formData, `/course/chapter/lecture/picture`)
        .then(x => {
          alert('강좌 추가를 완료하였습니다.')
          this.$emit('refresh')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

