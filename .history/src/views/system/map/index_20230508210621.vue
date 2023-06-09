<template>
    <div>
      <el-card>
        <div id="map-container" style="height: 500px;"></div>
      </el-card>
    </div>
</template>
  
<script >

import AMap from 'vue-amap'
  export default {
    name: "Map",
    data() {
      return {
        map: null,
        marker: null
      };
    },
    mounted() {
        // 初始化地图
        AMap.initAMapApiLoader().then(() => {
            this.map = new this.$amap.Map('map-container', {
                // 地图选项
            })
        })
    },
    methods: {
      initMap() {
        this.map = new this.$amap.Map("map-container", {
          zoom: 10,
          center: [116.397428, 39.90923]
        });
        this.marker = new this.$amap.Marker({
          position: [116.397428, 39.90923],
          map: this.map
        });
      }
    },
    activated() {
        if (this.map) {
            this.map.destroy();
            this.map = null;
        }
        this.initMap();
    },
  };
  </script>