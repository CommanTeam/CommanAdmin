import Vue from 'vue'
import Router from 'vue-router'
import RegisterInstructor from '@/components/RegisterInstructor'
import MainRegisterCourse from '@/components/MainRegisterCourse'
import RegisterCourse from '@/components/RegisterCourse'

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
      name: 'MainRegisterCourse',
      component: MainRegisterCourse
    }
  ]
})
