import Vue from 'vue'
import Router from 'vue-router'
import RegisterInstructor from '@/components/RegisterInstructor'
import RegisterCourse from '@/components/RegisterCourse'
import RegisterVideo from '@/components/RegisterVideo'
import RegisterPicture from '@/components/RegisterPicture'
import RegisterQuiz from '@/components/RegisterQuiz'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/register_instructor',
      name: 'RegisterInstructor',
      component: RegisterInstructor
    },
    {
      path: '/course',
      name: 'RegisterCourse',
      component: RegisterCourse,
      children: [
        {
          path: 'lecture/video',
          name: 'RegisterVideo',
          component: RegisterVideo
        },
        {
          path: 'lecture/picture',
          name: 'RegisterPicture',
          component: RegisterPicture
        },
        {
          path: 'lecture/quiz',
          name: 'RegisterQuiz',
          component: RegisterQuiz
        }
      ]
    }
  ]
})
