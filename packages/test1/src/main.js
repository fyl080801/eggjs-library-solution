import Vue from 'vue';
import App from './App.vue';
import CompositionApi from '@vue/composition-api';
import 'systemjs/dist/s';
// import '@egglib/test2';

Vue.config.productionTip = false;

Vue.use(CompositionApi);
const paths = ['@egglib/test2'];
// eslint-disable-next-line no-undef
Promise.all([paths.map((item) => System.import(item))]).then(() => {
  new Vue({
    render: (h) => h(App),
  }).$mount('#app');
});
