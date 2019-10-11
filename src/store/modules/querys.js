
const querys = {
  state: {
      nolocale:null,
      tablelocale:null,
      gzwlocale:null,
      export:null
  },

  mutations: {
    SET_NOLOCALE: (state, payload) => {
      state.nolocale = payload
    },
    SET_TABLELOCALE:(state,payload) =>{
      state.tablelocale = payload
    },
    SET_GZWLOCALE:(state,payload) =>{
      state.gzwlocale = payload
    },
    SET_EXPORT:(state,payload) =>{
      state.export = payload
    }
  }
}

export default querys