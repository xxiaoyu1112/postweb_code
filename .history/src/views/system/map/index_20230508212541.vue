<template>
    <div>
      <el-card>
        <div id="map-container" style="height: 500px;"></div>
      </el-card>
    </div>
</template>

<script src="https://webapi.amap.com/maps?v=1.4.15&key=1c9f2d7558480c8c020f14c6de8dc120"></script>
<script >
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
        // 创建地图实例
        const map = new AMap.Map('mapContainer', {
            zoom: 10,
            center: [116.39, 39.9]
        })

        // 添加插件
        AMap.plugin([
            'AMap.ToolBar',
            'AMap.Scale',
            'AMap.OverView',
            'AMap.MapType',
            'AMap.Geolocation',
        ], function() {
            map.addControl(new AMap.ToolBar())
            map.addControl(new AMap.Scale())
            map.addControl(new AMap.OverView({ isOpen: true }))
            map.addControl(new AMap.MapType())
            map.addControl(new AMap.Geolocation())
        })
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