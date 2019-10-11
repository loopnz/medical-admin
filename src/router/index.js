import Vue from 'vue'
import Router from 'vue-router'
// import Locale from '../views/manager/locale.vue'
// import Purchase from '../views/manager/purchase.vue'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
//所有权限通用路由表,如首页和登录页和一些不用权限的公用页面
export const constantRouterMap = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: '首页',
      meta: {
        title: '首页',
        icon: 'dashboard'
      }
    }]
  }
]
export default new Router({
  mode: 'history', // 后端支持可开
  base:process.env.VUE_APP_BASE_PATH,
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})










// //异步挂载的路由,动态需要根据权限加载的路由表 
// export const asyncRouterMap = [
//   {
//     path: '/permission',
//     component: Layout,
//     name: '权限测试',
//     meta: { role: ['admin','super_editor'] }, //页面需要的权限
//     children: [
//     { 
//       path: 'index',
//       component: Permission,
//       name: '权限测试页',
//       meta: { role: ['admin','super_editor'] }  //页面需要的权限
//     }]
//   },
//   { path: '*', redirect: '/404', hidden: true }
// ];