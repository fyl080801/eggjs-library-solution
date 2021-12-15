import Vue from 'vue';
import TestComponent from './components/TestComponent.vue';

Vue.component('testCmp', TestComponent);

console.log('xxxx');

export default ({ useServiceProvider }) => {
  useServiceProvider(({ addService }) => {
    addService('main.console', () => {
      console.log('service');
    });
  });
};
