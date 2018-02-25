import Vue from 'vue'
import Router from 'vue-router'
import Products from '../components/Products'
import Login from '../components/login'
import Cart from '@/components/cart'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/products',
      name: 'products',
      component: Products,
      beforeEnter (to, from, next) {
        if (localStorage.session === undefined) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/',
      name: 'products',
      component: Products,
      beforeEnter (to, from, next) {
        if (localStorage.session === undefined) {
          next('/login')
        } else {
          next('/products')
        }
      }
    },
    {
      path: '/cart',
      component: Cart,
      name: 'cart',
      beforeEnter (to, from, next) {
        if (localStorage.session === undefined) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/login',
      component: Login,
      name: 'login',
      beforeEnter (to, from, next) {
        if (localStorage.session === undefined) {
          next()
        } else {
          next('/products')
        }
      }
    },
    {
      path: '*',
      redirect: '/products'
    }
  ]
})
