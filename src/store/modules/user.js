import {
  reqPost, reqGet
} from '@/utils/web';
import config from '@/utils/config';
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
const user = {
  state: {
    token: getToken(),
    name: '',
    userID: '',
    roles: [],
    user: null,
    gName: '',
    gId: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USERID: (state, userID) => {
      state.userID = userID
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
    SET_GNAME: (state, gName) => {
      state.gName = gName;
    },
    SET_GID: (state, gId) => {
      state.gId = gId;
    },
    SET_TIME:(state,payload)=>{
      state.expiration = payload;
    }
  },

  actions: {
    // 登录
    // userInfo user用户名，密码(VUE文件传入)
    Login({
      commit
    }, userInfo) {
      //去空格
      userInfo.username = userInfo.username.trim();
      return reqPost(config.loginURL, userInfo).then(res => {
        if (res.code === 200) {
          commit('SET_TOKEN', res.data.token);
          commit('SET_TIME',res.data.expiration);
          setToken(res.data.token);
        }
        return res;
      });
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return reqGet(config.getUserInfo).then(res => {
        commit('SET_USER', res.data);
        commit('SET_USERID', res.data.id);
        commit('SET_GNAME', res.data.gName);
        commit('SET_GID', res.data.gID);
        return res;
      });
    },
    GetPermissionTree({ commit, state },userID) {
      var newUrl = config.getPermissionTree+'/'+state.userID
      return reqGet(newUrl,userID).then(res => {
        if (res.code === 200) {
          commit('SET_ROLES', res.data);
          commit('SET_flagPermission',1)
        }
        return res;
      });
    },



    // 登出
    LogOut({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      // return new Promise(resolve => {
      //   commit('SET_TOKEN', '')
      //   removeToken()
      //   resolve()
      // })
      return reqPost(config.logoutURL, {}).then(res => {
        commit('SET_TOKEN', '')
        removeToken()
        // resolve()
      });
    }
  }
}

export default user