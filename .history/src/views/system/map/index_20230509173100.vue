<template>
    <div class="home_div">
        <div class="map_title">
            <h3>揽件地图展示</h3>
            <div style="display: flex; justify-content: flex-end; align-items: center;height: 56px;">
                <el-button type="primary" @click="goBackPredictPage" style="margin-right: 10px;">返回地图</el-button>
            </div>
        </div>
        <!-- 卡片内容 -->
        <div class="card-container">
            <div class="card">
                <h3>这是一个卡片</h3>
                <el-button style="" @click="setMark">加载地点</el-button>
                <p>卡片内容...</p>
                <el-button @click="handleClose">关闭</el-button>
            </div>
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
        }).then((AMap) => {
            this.map = new AMap.Map("container", {
                resizeEnable: true,
                viewMode: "3D",
                center: [120.180503,30.323697],
                zoom: 16,
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
        }).catch((e) => {
            console.log(e);
        });
    },
    setMark(){
        var marker = new AMap.Marker({
            position: this.map.getCenter(),
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            anchor:'bottom-center',
            offset: new AMap.Pixel(0, 0)
        });
        marker.setMap(this.map);
        // 设置鼠标划过点标记显示的文字提示
        marker.setTitle('我是marker的title');
        // 设置label标签
        // label默认蓝框白底左上角显示，样式className为：amap-marker-label
        marker.setLabel({
            direction:'right',
            offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
            content: "<div class='info'>我是 marker 的 label 标签</div>", //设置文本标注内容
        });
    },
    goBackPredictPage(){
      this.$router.push({ path: '/courier_predict' });
    },
    handleClose() {
      // 关闭卡片前的处理
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
    height: 60px;
    background-color: rgba(27, 25, 27, 0.884);
}

.card h3 {
    position: absolute;
    left: 10px;
    z-index: 2;
    color: black;
}
/* 设置卡片容器样式 */
.card-container {
  position: fixed;
  top: 20%;
  left: 2%;
  /* transform: translate(-50%, -50%); */
  width: 30%;
  height: 70%;
  z-index: 9999;
}

/* 设置卡片样式 */
.card {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.24);
}
</style>
