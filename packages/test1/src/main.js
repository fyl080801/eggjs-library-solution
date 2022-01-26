import Vue from 'vue';
import App from './App.vue';
import CompositionApi from '@vue/composition-api';
import { plugins } from './plugins';
// import { useServiceProvider } from '@egglib/di';

Vue.config.productionTip = false;

Vue.use(CompositionApi);

const paths = ['@egglib/test2'];

Promise.all(
  plugins.filter((p) => paths.includes(p.name)).map((p) => p.importer()),
).then((modules) => {
  // modules.forEach(
  //   (m) =>
  //     m.default &&
  //     typeof m.default === 'function' &&
  //     m.default({ useServiceProvider }),
  // );

  new Vue({
    render: (h) => h(App),
  }).$mount('#app');
});

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
