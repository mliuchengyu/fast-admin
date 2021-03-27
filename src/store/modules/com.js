const state = {
  vxshow: false
};
const mutations = {
  SET_VXSHOW: (state, params) => {
    state.vxshow = params;
  }

};

const actions = {
  // setSearchFrom({ commit }, searchFrom) {
  //   commit('SET_SEARCH_FROM', searchFrom);
  // }

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
