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
        console.log(AMap);
        console.log(this.$amap);
        this.initMap()
    },
    methods: {
      initMap() {
        this.map = new AMap.Map("map-container", {
          zoom: 10,
          center: [116.397428, 39.90923]
        });
        this.marker = new AMap.Marker({
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