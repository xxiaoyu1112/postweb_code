<template>
    <div class="home_div">
      <div class="map_title">
        <h3>高德地图预览</h3>
      </div>
      <div id="container"></div>
    </div>
  </template>
  <script>
  import AMapLoader from "@amap/amap-jsapi-loader";
  
  export default {
    name: "Mapview",
    data() {
      return {
        //map:null,
      };
    },
    created() {},
    mounted() {
      this.initAMap();
    },
    methods: {
      initAMap() {
        AMapLoader.load({
          key: "1c9f2d7558480c8c020f14c6de8dc120", //设置您的key
          version: "2.0",
          plugins: ["AMap.ToolBar", "AMap.Driving"],
          AMapUI: {
            version: "1.1",
            plugins: [],
          },
          Loca: {
            version: "2.0",
          },
        })
          .then((AMap) => {
            this.map = new AMap.Map("container", {
              viewMode: "3D",
              zoom: 5,
              zooms: [2, 22],
              center: [105.602725, 37.076636],
            });
          })
          .catch((e) => {
            console.log(e);
          });
      },
    },
  };
  </script>
  <style scoped>
  .home_div {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  #container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
    position: absolute;
  }
  
  .map_title {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 50px;
    background-color: rgba(27, 25, 27, 0.884);
  }
  
  h3 {
    position: absolute;
    left: 10px;
    z-index: 2;
    color: white;
  }
  </style>
  