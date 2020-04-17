import Vue from 'vue';

import 'normalize.css';
import 'remixicon/fonts/remixicon.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import router from './router';
import store from './store';
import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(ElementUI, { size: 'small' });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');