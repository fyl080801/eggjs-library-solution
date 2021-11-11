import Vue from 'vue';
// import App from './App.vue';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h('div', { domProps: { innerText: 'zzzzzddsds' } }),
}).$mount('#app');
