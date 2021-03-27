
const state = {
  searchFrom: {},
  loadingBool: false,
  loadingBtn: false,
};
const mutations = {
  SET_SEARCH_FROM: (state, searchFrom) => {
    state.searchFrom = searchFrom;
  },
  SET_PAGE: (state, page) => {
    state.searchFrom.page = page;
  },
  SET_LOADING: (state, bool) => {
    state.loadingBool = bool;
  },
  SET_LOADINGBTN: (state, bool) => {
    state.loadingBtn = bool;
  }
};

const actions = {
  setSearchFrom({ commit }, obj) {
    commit('SET_SEARCH_FROM', obj);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
