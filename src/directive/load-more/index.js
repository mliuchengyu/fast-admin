import loadMore from './loadMore';

const install = (Vue) => {
  Vue.directive('load-more', loadMore);
};

if (window.Vue) {
  window['load-more'] = loadMore;
  Vue.use(install); // eslint-disable-line
}

loadMore.install = install;
export default loadMore;
