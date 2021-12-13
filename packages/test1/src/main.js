import Vue from 'vue';
import App from './App.vue';
import CompositionApi from '@vue/composition-api';
// import 'systemjs/dist/s';
// import '@egglib/test2';

Vue.config.productionTip = false;

Vue.use(CompositionApi);
// const paths = ['@egglib/test2'];

// Promise.all([paths.map(async (item) => await System.import(item))]).then(
//   (res) => {
//     console.log(res);
//     debugger;
//     new Vue({
//       render: (h) => h(App),
//     }).$mount('#app');
//   },
// );

// // eslint-disable-next-line no-undef
// System.import('/@egglib/test2/main.js');

new Vue({
  render: (h) => h(App),
}).$mount('#app');
