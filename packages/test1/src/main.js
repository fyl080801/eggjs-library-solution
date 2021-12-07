import Vue from 'vue';
import App from './App.vue';
import CompositionApi from '@vue/composition-api';
// import 'systemjs/dist/s';
// import '@egglib/test2';

Vue.config.productionTip = false;

Vue.use(CompositionApi);
// const paths = ['@egglib/test2'];

// eslint-disable-next-line no-undef
// Promise.all([paths.map(async (item) => await System.import(item))]).then(
//   (res) => {
//     console.log(res);
//     debugger;
//     new Vue({
//       render: (h) => h(App),
//     }).$mount('#app');
//   },
// );

new Vue({
  render: (h) => h(App),
}).$mount('#app');
