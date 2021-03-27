import Vue from 'vue';

import Cookies from 'js-cookie';

import 'normalize.css/normalize.css'; // a modern alternative to CSS resets

import Element from 'element-ui';
import './styles/element-variables.scss';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';
import request from '@/utils/request';
import bus from '@/utils/bus';

import './icons'; // icon
import './permission'; // permission control
import './utils/error-log'; // error log

import * as filters from './filters'; // global filters
import './directive/track';
import './components/Auto';
// 权限框架注册全局
import permission from '@/directive/permission/index.js'; // 权限判断指令
Vue.use(permission);
// import loadMore from '@/directive/load-more/loadMore'; // 下拉加载更多
// Vue.use(loadMore);
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock');
  mockXHR();
}

Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
});
Vue.prototype.request = request;
Vue.prototype.bus = bus;

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
