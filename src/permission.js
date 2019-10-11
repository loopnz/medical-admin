import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

// permission judge function
function hasPermission(roles, routers, name) {
  if (roles.indexOf('admin') >= 0) return true // admin permission passed directly 直接通过许可
  const have = match(routers, name)
  return have
}

function match(routers, name) {
  let flag = false
  routers.forEach(router => {
    if (router.name === name) {
      flag = true
    }
    if (router.children) {
      flag = match(router.children, name)
    }
    if (flag) {
      return false
    }
  })
  return flag
}

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar 上方进度条
  if (getToken()) {
    // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({
        path: '/'
      })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // console.log(store.getters.flagPermission);
      if (store.getters.flagPermission === 0) {
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => {
          // 拉取user_info
          if (res.code == 200) {
            store.dispatch('GetPermissionTree').then(res => {
              // console.log(store.getters.roles)
              const roles = store.getters.roles
              store.commit('SET_ROLES', roles)
              let routers1 = store.getters.roles
              let routers = []
              var footer = [
                {
                  path: '/tableDetails',
                  component: 'Layout',
                  name: 'tableDetail',
                  hidden: true,
                  children: [
                    {
                      path: 'nolocale',
                      name: 'tableNoLocale',
                      component: 'review/nolocale',
                      meta: {
                        title: '非进博会成交统计表'
                      }
                    },
                    {
                      path: 'locale',
                      name: 'tableLocale',
                      component: 'review/locale',
                      meta: {
                        title: '进博会成交统计表'
                      }
                    },
                    {
                      path: 'export',
                      name: 'tableExport',
                      component: 'review/export',
                      meta: {
                        title: '出口信息表'
                      }
                    },
                    {
                      path: 'gzwlocale',
                      name: 'gzwlocale',
                      component: 'review/gzwlocale',
                      meta: {
                        title: '分团进博会成交统计表'
                      }
                    }
                  ]
                },
                {
                  path: '/pageHead',
                  component: 'Layout',
                  name: 'pageHead',
                  hidden: true,
                  children: [
                    {
                      path: 'userCore',
                      name: 'UserCore',
                      component: 'userManager/userCore',
                      meta: {
                        title: '个人中心'
                      }
                    },
                    {
                      path: 'updatePassword',
                      name: 'updatePassword',
                      component: 'userManager/updatePassword',
                      meta: {
                        title: '修改密码'
                      }
                    }
                  ]
                },
              
                {
                  path: '*',
                  redirect: '/404',
                  hidden: true
                }
              ]

              routers = routers1.concat(footer)
              // console.log(routers)
              // if (routers.length === 0) {
              //   routers = [
              //     {
              //       path: '/manager',
              //       component: 'Layout',
              //       name: 'manager',
              //       meta: {
              //         title: '信息管理',
              //         icon: 'chanpin'
              //       },
              //       children: [
              //         {
              //           path: 'purchase',
              //           name: 'purchase',
              //           component: 'manager/index',
              //           meta: {
              //             title: '进口信息管理',
              //           },
              //           children: [{
              //             path: 'import',
              //             name: 'import',
              //             component: 'manager/purchase',
              //             meta: {
              //               title: '非博览会成交统计',

              //             },
              //           },
              //           {
              //             path: 'locale',
              //             name: 'locale',
              //             component: 'manager/locale',
              //             meta: {
              //               title: '博览会成交统计',
              //             },
              //           }
              //             , {
              //             path: 'locale',
              //             name: 'locale',
              //             component: 'manager/locale',
              //             meta: {
              //               title: '博览会成交统计',
              //             },
              //           }
              //           ]
              //         },
              //         {
              //           path: 'export',
              //           name: 'export',
              //           component: 'manager/export',
              //           meta: {
              //             title: '出口信息管理',
              //           }
              //         },
              //         {
              //           path: 'supplier',
              //           name: 'supplier',
              //           component: 'manager/supplier/index',
              //           meta: {
              //             title: '供货商信息管理',
              //           },
              //           children: [{
              //             path: 'supplierAdd',
              //             name: 'supplierAdd',
              //             component: 'manager/supplier/supplier',
              //             meta: {
              //               title: '邀请名单',

              //             },
              //           },
              //           {
              //             path: 'supplierName',
              //             name: 'supplierName',
              //             component: 'manager/supplier/supplierName',
              //             meta: {
              //               title: '供货商名录',
              //             },
              //           }
              //           ]
              //         },
              //         {
              //           path: 'doc',
              //           name: 'doc',
              //           component: 'manager/doc',
              //           meta: {
              //             title: '文档填报'
              //           }
              //         },
              //       ]
              //     },
              //     {
              //       path: '/review',
              //       name: 'review',
              //       component: 'Layout',
              //       meta: {
              //         title: '信息审核',
              //         icon: 'example'
              //       },
              //       children: [
              //         {
              //           path: 'import',
              //           name: 'reviewImport',
              //           component: 'review/index',
              //           meta: {
              //             title: '进口信息审核',
              //           },
              //           children: [{
              //             path: 'purchase',
              //             name: 'reviewPurchase',
              //             component: 'review/reviewPurchase',
              //             meta: {
              //               title: '非博览会成交统计',
              //             },
              //           },
              //           {
              //             path: 'locale',
              //             name: 'reviewLocale',
              //             component: 'review/reviewLocale',
              //             meta: {
              //               title: '博览会成交统计',

              //             },
              //           }
              //           ]
              //         },
              //         {
              //           path: 'export',
              //           name: 'reviewExport',
              //           component: 'review/reviewExport',
              //           meta: {
              //             title: '出口信息审核',

              //           }
              //         },
              //         {
              //           path: 'doc',
              //           name: 'reviewDoc',
              //           component: 'review/reviewDoc',
              //           meta: {
              //             title: '文档填报审核',
              //           }
              //         },
              //       ]

              //     },
              //     {
              //       path: '/show',
              //       name: 'show',
              //       component: 'Layout',
              //       meta: {
              //         title: '信息展示',
              //         icon: 'table'
              //       },
              //       children: [{
              //         path: 'list',
              //         name: 'showList',
              //         component: 'show/list/index',
              //         meta: {
              //           title: '明细表',
              //         },
              //         children: [{
              //           path: 'purchase',
              //           name: 'showPurchase',
              //           component: 'show/list/showPurchase',
              //           meta: {
              //             title: '历年采购调查表',

              //           },
              //         },
              //         {
              //           path: 'locale',
              //           name: 'showLocale',
              //           component: 'show/list/showLocale',
              //           meta: {
              //             title: '现场成交统计表',

              //           },
              //         },
              //         {
              //           path: 'doc',
              //           name: 'showDoc',
              //           component: 'show/list/showDoc',
              //           meta: {
              //             title: '文档类',

              //           },
              //         }
              //         ]
              //       }, {
              //         path: 'rollup',
              //         name: 'showRollup',
              //         component: 'show/rollup/index',
              //         meta: {
              //           title: '自定义汇总表',
              //         },
              //         children: [{
              //           path: 'purchase',
              //           name: 'showRollupPurchase',
              //           component: 'show/rollup/rollupPurchase',
              //           meta: {
              //             title: '历年采购调查表',
              //           },
              //         },
              //         {
              //           path: 'locale',
              //           name: 'showRollupLocale',
              //           component: 'show/rollup/rollupLocale',
              //           meta: {
              //             title: '现场成交统计表',
              //           },
              //         }
              //         ]
              //       }, {
              //         path: 'chart',
              //         name: 'chart',
              //         component: 'show/chart/index',
              //         meta: {
              //           title: '统计图表',
              //         },
              //         children: [{
              //           path: 'purchase',
              //           name: 'showChartPurchase',
              //           component: 'show/chart/purchase',
              //           meta: {
              //             title: '历年采购调查表',
              //           },
              //         },
              //         {
              //           path: 'locale',
              //           name: 'showChartLocale',
              //           component: 'show/chart/locale',
              //           meta: {
              //             title: '现场成交统计表',
              //           },
              //         }
              //         ]
              //       }, {
              //         path: 'fixRollup',
              //         name: 'showFixRollup',
              //         component: 'show/fixed',
              //         meta: {
              //           title: '固定汇总',

              //         },
              //       }]
              //     },

              //     {
              //       path: '/supplier',
              //       name: 'supplier',
              //       component: 'Layout',
              //       meta: {
              //         title: '供货商管理',
              //         icon: 'tree'
              //       },
              //       children: [
              //         {
              //           path: 'supplierName',
              //           name: 'supplierName',
              //           component: 'supplier/supplierName',
              //           meta: {
              //             title: '供货商名录',

              //           },
              //         },
              //         {
              //           path: 'invitationName',
              //           name: 'invitationName',
              //           component: 'supplier/invitationName',
              //           meta: {
              //             title: '央企邀请名单',

              //           },
              //         }
              //       ]
              //     },


              //     {
              //       path: '/user',
              //       component: 'Layout',
              //       name: 'User',
              //       meta: {
              //         title: '用户管理',
              //         icon: 'power'
              //       },
              //       children: [{
              //         path: 'list',
              //         name: 'userlist',
              //         component: 'userManager/userList',
              //         meta: {
              //           title: '用户列表'
              //         }
              //       }]
              //     },
              //     {
              //       path: '/editdoc',
              //       component: 'Layout',
              //       name: 'editdoc',
              //       meta: {
              //         title: '文档管理',
              //         icon: 'data'
              //       },
              //       children: [{
              //         path: 'index',
              //         name: 'editdocIndex',
              //         component: 'editdoc',
              //         meta: {
              //           title: '文档编辑'
              //         }
              //       }]
              //     },
              //     {
              //       path: '/tableDetails',
              //       component: 'Layout',
              //       name: 'tableDetail',
              //       hidden: true,
              //       children: [{
              //         path: 'nolocale',
              //         name: 'tableNoLocale',
              //         component: 'review/nolocale',
              //         meta: {
              //           title: '非博览会成交统计表'
              //         }
              //       },
              //       {
              //         path: 'locale',
              //         name: 'tableLocale',
              //         component: 'review/locale',
              //         meta: {
              //           title: '博览会成交统计表'
              //         }
              //       },
              //       {
              //         path: 'export',
              //         name: 'tableExport',
              //         component: 'review/export',
              //         meta: {
              //           title: '出口信息表'
              //         }
              //       }
              //       ]
              //     },
              //     {
              //       path: '*',
              //       redirect: '/404',
              //       hidden: true
              //     }
              //   ]
              // }
              store
                .dispatch('GenerateRoutes', {
                  roles,
                  routers
                })
                .then(() => {
                  // 根据roles权限生成可访问的路由表
                  router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                  next({
                    ...to,
                    replace: true
                  }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                })
              // }).catch((err) => {
              //   store.dispatch('FedLogOut').then(() => {
              //     Message.error(err)
              //     next({
              //       path: '/'
              //     })
            })
          } else {
            Message.warning(res.message)
            store.commit('SET_TOKEN', '')
            store.commit('SET_ROLES', [])
            removeToken()
            next(`/login`) // 否则全部重定向到登录页
            NProgress.done()
          }
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        next()
        // if (hasPermission(store.getters.roles, store.getters.routers, to.name)) {
        //   next()
        // } else {
        //   next({
        //     path: '/401',
        //     replace: true,
        //     query: {
        //       noGoBack: true
        //     }\
        //   })
        // }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
