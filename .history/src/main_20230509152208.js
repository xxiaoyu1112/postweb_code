// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'
import { menuHeader, menuAside } from '@/menu'
import { frameInRoutes } from '@/router/routes'

// 核心插件
Vue.use(d2Admin)

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';

Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);

// import AMap from 'vue-amap'

// Vue.config.productionTip = false

// Vue.use(AMap)
// AMap.initAMapApiLoader({
//   key: '1c9f2d7558480c8c020f14c6de8dc120',
//   plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar'],
//   v: '1.4.15',
//   uiVersion: '1.0.11'
// })
new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
    created() {
        // 处理路由 得到每一级的路由设置
        this.$store.commit('d2admin/page/init', frameInRoutes)
            // 设置顶栏菜单
        this.$store.commit('d2admin/menu/headerSet', menuHeader)
            // 设置侧边栏菜单
        this.$store.commit('d2admin/menu/asideSet', menuAside)
            // 初始化菜单搜索功能
        this.$store.commit('d2admin/search/init', menuHeader)
    },
    mounted() {
        // 展示系统信息
        this.$store.commit('d2admin/releases/versionShow')
            // 用户登录后从数据库加载一系列的设置
        this.$store.dispatch('d2admin/account/load')
            // 获取并记录用户 UA
        this.$store.commit('d2admin/ua/get')
            // 初始化全屏监听
        this.$store.dispatch('d2admin/fullscreen/listen')
    }
}).$mount('#app')