import Vue from 'vue';
import App from './App.vue';

import store from './store/index'

//开启debug模式
Vue.config.debug = true;

const app = new Vue({
    store: store,
    render: h => h(App)
}).$mount('#app')
