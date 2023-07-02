import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/vi";

Vue.use(Element, { locale });
Vue.use(VueRouter)
  
  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add',
    name: 'Add',
    // route level code-splitting
    // this generates a separate chunk (add.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "add" */ '../views/Add.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
