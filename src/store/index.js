import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import app from './modules/app'
import user from './modules/user'
import querys from './modules/querys'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    tagsView,
    querys
  },
  state: {
    flagPermission: 0,
    caches: [],
    countrys: [],
    signTimes:[],
    currentRow: {},
    localeRow: {},
    exportRow: {},
    gzwlocalRow:{}
  },
  getters,
  mutations: {
    SET_SIGNTIMES: (state, payload) => {
      state.signTimes = payload;
    },
    SET_COUNTRY: (state, country) => {
      state.countrys = country
    },
    CURRENTGRID: (state, payload) => {
      state.currentRow = payload;
    },
    LOCALEGRID: (state, payload) => {
      state.localeRow = payload;
    },
    EXPORTGRID: (state, payload) => {
      state.exportRow = payload;
    },
    GZWLOCALGRID:(state, payload) => {
      state.gzwlocalRow = payload;
    },
    SET_flagPermission: (state, flagPermission) => {
      state.flagPermission = flagPermission;
    },
    ADDCACHE: (state, payload)  =>{
      var arr = state.caches;
      if (arr.indexOf(payload) === -1) {
        arr.push(payload);
        state.caches = arr.slice();
      }
    },
    REMOVECACHE: (state, payload) =>{
      var arr = state.caches;
      var idx = arr.indexOf(payload);
      if (idx !== -1) {
        arr.splice(idx, 1);
        state.caches = arr.slice();
      }
    }
  },
  plugins: [createPersistedState({
    reducer(val) {
      return {
        app: val.app,
        user: val.user,
        countrys: val.countrys || [],
        signTimes:val.signTimes||[],
        currentRow: val.currentRow || {
          row: {}
        },
        localeRow: val.localeRow || {
          row: {}
        },
        exportRow: val.exportRow || {
          row: {}
        },
        gzwlocalRow:val.exportRow || {
          row: {}
        }
      }
    }
  })]
})

export default store