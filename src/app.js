/**
 * Created by jiangtao on 2017/5/17.
 */

import Vue from 'vue';

const {
    $nextTick
} = Vue.prototype;

import {
    App,
    Login,
    TButton,
    THeader,
    ScrollView
} from './components';

//全局注册组件
Vue.component(`ScrollView`, ScrollView);
Vue.component(`TButton`, TButton);
Vue.component(`THeader`, THeader);

//指令
import './directive';

//网络
import http from './common/http';

Vue.prototype.$http = window.ajax = http;

import router from './router';

import store from './store';

import PopUp from './components/PopUp';

const $PopUp = new PopUp();

const $openLogin = cb => (
    $PopUp.show(Login, {
        position: `bottom`,
        opacity: 0,
        maskDuration: 300,
        contentDuration: 400,
        disableTapClose: true,
        cubicBezier:`cubic-bezier(.36, .66, .04, 1)`
    }, {success: cb})
);

//通用登录唤起
Vue.prototype.$openLogin = $openLogin;

//通用多功能弹出层
Vue.prototype.$PopUp = $PopUp;

// 开启debug模式
Vue.config.debug = __DEV__;


//全局通用loading
window.loading = () => (
    $PopUp.loading()
);

window.loadingClose = () => (
    $PopUp.loadingClose()
);

//全局获取用户是否登录
window.getUserLogin = () => {
    const {user} = store.state;
    return user.isLogin;
};

Vue.prototype.$getUserLogin = getUserLogin();

router.beforeEach(({meta}, from, next) => $nextTick(() => {
    const isLogin = getUserLogin();
    const {
        shouldLogin = false
    } = meta;
    //检查当当前页面需要登录，如果用户未登录，那么弹起登录页面
    if (shouldLogin && !isLogin) {
        return $openLogin(done => {
            done();
            next();
        });
    }
    next();
}));

new Vue({
    render: (h) => h(App),
    router,
    store
}).$mount('#root');








