<template>
  <div>
    <div v-if="!uploadCompleted">
    <label>문제 목록</label>
    <div class="list-elem"
         v-for="question in questionList"
         v-bind:key="question.id">
         <label>문제 순서: {{question.priority}}</label>
         <label>문제: {{question.title}} </label> 
    </div>
    <label>새 문제 제목</label>
    <input type='text' v-model="newQuestionTitle"/>
    <label>새 문제 순서</label>
    <input type='text' v-model="newQuestionPriority"/>
    <label>새 문제 보기 수</label>
    <select v-model="newQuestionChoiceCount">
      <option v-for="n in maxChoiceCount"
              v-bind:value="n"
              v-bind:key="n">
              {{n}}
      </option>
    </select>
    <div class='list-elem'
         v-for="n in newQuestionChoiceCount"
         v-bind:key="n">
         <label>{{n}} 번 째 보기</label>
         <input type='text' v-model="newQuestionChoices[n-1].text"/>
    </div>
    <label>정답 문항 보기</label>
    <select v-model="newAnswerIndex">
      <option v-for="n in newQuestionChoiceCount"
              v-bind:value="n"
              v-bind:key="n">
              {{n}} 번
      </option>
    </select>
    <label>답 설명</label>
    <input type='text' v-model="newQuestionExplanation"/>
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
          :multiple="false"
          :size="1024 * 1024 * 10"
          v-model="pictureFiles"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload">
          이미지 파일 찾기
        </file-upload>
      </div>
    </div>
    <button v-on:click="uploadQuestion">문제 업로드 하기</button>
    </div>
    <button v-if="uploadCompleted" v-on:click="reOpen">다시 업로드하기!</button>
  </div>
</template>

<script>
import axios from 'axios'
import FileUpload from 'vue-upload-component'
import { upload } from '../service/file-upload.service'
export default {
  components: {
    FileUpload
  },
  mounted () {
    for (var index = 0; index < this.maxChoiceCount - 1; index++) {
      this.newQuestionChoices.push({text: ''})
    }
    this.getQuestionList()
  },
  data () {
    return {
      maxChoiceCount: 10,
      newQuestionTitle: null,
      newQuestionChoices: [
        {text: ''}
      ],
      newQuestionChoiceCount: 1,
      newQuestionPriority: 1,
      newAnswerIndex: 1,
      newQuestionExplanation: '',
      questionList: [],
      pictureFiles: [],
      uploadCompleted: false
    }
  },
  props: ['selectedLecture'],
  methods: {
    getQuestionList () {
      axios.get(`course/chapter/lecture/quiz/question?lectureId=${this.selectedLecture.id}`)
        .then(res => {
          this.questionList = res.data.questionList
          console.log()
        })
        .catch(err => {
          console.log(err)
        })
    },
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
    },
    inputFile (newFile, oldFile) {
      if (newFile && !oldFile) {
        console.log('add', newFile)
      }
      if (newFile && oldFile) {
        console.log('update', newFile)
      }
      if (!newFile && oldFile) {
        console.log('remove', oldFile)
      }
    },
    uploadQuestion () {
      var formData = new FormData()
      formData.append('title', this.newQuestionTitle)
      formData.append('priority', this.newQuestionPriority)
      formData.append('lectureId', this.selectedLecture.id)
      formData.append('explanation', this.newQuestionExplanation)
      var choiceStringList = ''
      var choices = this.newQuestionChoices
      for (var i = 0; i < choices.length; i++) {
        if (choices[i].text === '') {
          break
        } else {
          if (i !== 0) {
            choiceStringList += '@'
          }
          choiceStringList += choices[i].text
        }
      }
      formData.append('choices', choiceStringList)
      formData.append('answerIndex', this.newAnswerIndex)
      if (this.pictureFiles[0] !== undefined) {
        formData.append('questionPicture', this.pictureFiles[0].file, this.pictureFiles[0].name)
      }
      upload(formData, `course/chapter/lecture/quiz/question`)
        .then(res => {
          alert('문제 추가를 완료하였습니다.')
          this.$emit('refresh')
          this.getQuestionList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    reOpen () {
      this.uploadCompleted = false
    }
  }
}
</script>
