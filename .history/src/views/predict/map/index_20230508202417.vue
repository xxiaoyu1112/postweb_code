<template>
    <d2-container>
      <template slot="header">揽件地图展示</template>
      <el-container>
        <div id="app">
            <div id="map-container"></div>
        </div>
      </el-container>
    </d2-container>
</template>

<link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" />
<script src="https://webapi.amap.com/maps?v=2.0&key=754e85313e449da212182ae11428a14a&plugin=AMap.Riding"></script>
<script src="https://a.amap.com/jsapi_demos/static/demo-center/js/demoutils.js"></script>

<script>
let vm;
export default vm = {
  name: "map",
  components: {
  },
  data: function () {
    return {
    };
  },
  mounted() {
    this.initMap();
  },
  watch: {
  },
  methods: {
    initMap() {
      // 创建地图实例
      var map = new AMap.Map('map-container', {
        zoom: 10,
        center: [116.397428, 39.90923]
      });
      // 添加标记点
      var marker = new AMap.Marker({
        position: [116.397428, 39.90923],
        map: map
      });
    }
  },
};
</script>
<style>
#map-container {
  height: 500px;
  width: 100%;
}
</style>