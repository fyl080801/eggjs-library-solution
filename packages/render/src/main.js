import Vue from 'vue';
import VueCompositionAPI, { h, onMounted, ref } from '@vue/composition-api';
import JRender, { useGlobalRender } from '@jrender-legacy/core';
import JRenderExtends from '@jrender-legacy/extends';
import { LibExtends } from './components';
import { request } from './utils/request';

Vue.use(VueCompositionAPI);
Vue.use(JRender);

useGlobalRender(JRenderExtends);
useGlobalRender(LibExtends);

new Vue({
  setup() {
    const config = ref({});

    const load = (path) => {
      request({ url: '/api/v1/render', params: { path } }).then((response) => {
        config.value = response.data;
      });
    };

    const buildStateEvent = (type) => {
      const historyEvent = history[type];

      return function () {
        const handler = historyEvent.apply(this, arguments);
        const e = new Event('statechanged');
        e.arguments = arguments;
        window.dispatchEvent(e);
        return handler;
      };
    };

    history.pushState = buildStateEvent('pushState');

    history.replaceState = buildStateEvent('replaceState');

    window.addEventListener('statechanged', (e) => {
      const [state, title, path] = e.arguments;

      load(path);
    });

    onMounted(() => {
      load(window.location.pathname);
    });

    return () =>
      h(JRender, {
        props: config.value,
        on: {
          setup: ({ addFunction }) => {
            addFunction('PUSH_TO', (path) => {
              history.pushState({}, null, path);
            });

            addFunction('REPLACE_TO', (path) => {
              history.replaceState({}, null, path);
            });
          },
        },
      });
  },
}).$mount('#app');
