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

<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://webapi.amap.com/maps?v=1.4.15&key=b83a65bbf688be4127c18d3190efdaf8"></script>

<script>

export default vm = {
  name: "map",
  components: {
  },
  data: function () {
    // for sidebar left
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