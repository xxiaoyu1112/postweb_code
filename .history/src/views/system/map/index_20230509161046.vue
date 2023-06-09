<template>
    <div class="home_div">
      <div class="map_title">
        <h3>揽件地图展示</h3>
      </div>
      <div id="container"></div>
      <el-button @click="setMark">添加地点</el-button>
    </div>
  </template>
  <script>
  import AMapLoader from "@amap/amap-jsapi-loader";
  
  export default {
    name: "Mapview",
    data() {
      return {
        map:null,
      };
    },
    created() {},
    mounted() {
      this.initAMap();
    },
    methods: {
      initAMap() {
        AMapLoader.load({
          key: "1c9f2d7558480c8c020f14c6de8dc120", //设置高德地图的key
          version: "2.0",
          plugins: ["AMap.ToolBar", "AMap.Driving","AMap.Riding"],
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
                resizeEnable: true,
                viewMode: "3D",
                center: [120.180503,30.323697],
                zoom: 15,
                zooms: [2, 24]
            });
            //骑行导航
            var riding = new AMap.Riding({
                map: this.map,
                panel: "panel"
            }); 
            //根据起终点坐标规划骑行路线
            riding.search([120.180503,30.323697],[120.181946,30.323814], function(status, result) {
                // result即是对应的骑行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
                if (status === 'complete') {
                    console.log('绘制骑行路线完成')
                } else {
                    console.log('骑行路线数据查询失败' + result)
                }
            });
          })
          .catch((e) => {
            console.log(e);
          });
      },
      setMark(){
        console.log(this.map);
      }
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
  