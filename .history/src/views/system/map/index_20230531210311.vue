<template>
    <div class="home_div">
        <!-- head -->
        <div class="map_title">
            <h3>揽件地图展示</h3>
            <div style="display: flex; justify-content: flex-end; align-items: center;height: 56px;">
                <el-button type="primary" @click="goBackPredictPage" style="margin-right: 10px;">返回揽件系统</el-button>
                <el-button v-if="isReplaying" type="primary" @click="replayingData" style="margin-right: 10px;">轨迹点回放</el-button>
                <el-button v-if="!isReplaying" type="primary" @click="routeDesign" style="margin-right: 10px;">路线规划</el-button>
            </div>
        </div>
        <!-- 卡片内容 -->
        <div class="card-container">
            <div class="card-top">
                <!-- <el-button style="" @click="ridingRoute">加载地点</el-button> -->
                <!-- <el-button @click="handleClose">关闭</el-button> -->
                <div style="padding-top: 10px; padding-left: 10px">
                    按前缀筛选:
                    <el-cascader 
                        v-model="postmanIDPrefix" 
                        :options="options"
                        style="width: 43%"
                        :show-all-levels="false"
                        @change="getPostmanID"
                    >
                    </el-cascader>
                    <br>
                    <br>
                    快递员id：
                    <el-select
                        v-model="postmanID"
                        size="medium"
                        style="width: 46%"
                    >
                        <el-option
                        v-for="item in meta.dataPostman"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        size="medium"
                        @click.native="getPostmanWorkDate"
                        >
                        </el-option>
                    </el-select>
                    <br>
                    <br>
                    <a style="padding-left: 20px">日期： </a>
                    <el-select
                        v-model="workDay"
                        size="medium"
                        style="width: 43%;margin-left: 8px;"
                    >
                        <el-option
                        v-for="item in meta.dataIdList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        size="medium"
                        @click.native="setShowData"
                        >
                        </el-option>
                    </el-select>
                    <br>
                    <br>
                    <el-input
                        v-model="postmanID"
                        placeholder="输入快递员ID进行查询"
                        maxlength="13"
                        style="width: 200px"
                        size="medium"
                        @input="getPostmanWorkDate"
                    ></el-input>
                    <el-button
                        type="primary"
                        @click="getPostmanRawData"
                        style="margin-left: 20px"
                    >搜索</el-button>
                </div>
            </div>
            <el-card style="padding: 0px;" class="card-content" ref="card-content" :style="{height: containerHeight}">
                <div style="padding: 10px;">
                    <!-- <el-divider></el-divider> -->
                    <div>
                        <el-timeline>
                            <el-timeline-item
                            timestamp=""
                            placement="top"
                            v-for="(marker, idx) in showData.rawData"
                            :key="idx"
                            @click.native="handleChangeCenter(marker)"
                            >
                            <el-card>
                                <h4>经纬度:{{ marker.location }}</h4>
                                <p>地址:{{ marker.address }}</p>
                                <p>接单时间:{{ marker.dealTime }}</p>
                                <p>预约时间:{{ marker.appointmentTime }}</p>
                                <p>送达时间:{{ marker.dealFinishTime }}</p>
                                <el-button>揽收</el-button>
                            </el-card>

                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </div>
            </el-card>
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
        riding:null,
        postmanID:'',
        postmanIDPrefix:'',
        options:[
            {
            value: '2204',
            label: '2204',
            children: [{
                value: '22041',
                label: '22041',
            }]
            },
            {
            value: '2206',
            label: '2206',
            children: [{
                value: '22061',
                label: '22061',
            },{
                value: '22063',
                label: '22063',
            },{
                value: '22064',
                label: '22064',
            },{
                value: '22065',
                label: '22065',
            },{
                value: '22066',
                label: '22066',
            },{
                value: '22067',
                label: '22067',
            },{
                value: '22068',
                label: '22068',
            },{
                value: '22069',
                label: '22069',
            }]
            },
            {
            value: '2207',
            label: '2207',
            children: [
                {
                value: '22072',
                label: '22072',
            },{
                value: '22073',
                label: '22073',
            },{
                value: '22075',
                label: '22075',
            },{
                value: '22076',
                label: '22076',
            },{
                value: '22077',
                label: '22077',
            },{
                value: '22078',
                label: '22078',
            },{
                value: '22079',
                label: '22079',
            }]
            },
            {
            value: '2208',
            label: '2208',
            children: [{
                value: '22081',
                label: '22081',
            },{
                value: '22083',
                label: '22083',
            },{
                value: '22084',
                label: '22084',
            },{
                value: '22086',
                label: '22086',
            },{
                value: '22089',
                label: '22089',
            }]
            },
            {
            value: '2209',
            label: '2209',
            children: [{
                value: '22091',
                label: '22091',
            },{
                value: '22092',
                label: '22092',
            },{
                value: '22093',
                label: '22093',
            },{
                value: '22094',
                label: '22094',
            },{
                value: '22095',
                label: '22095',
            },{
                value: '22096',
                label: '22096',
            },{
                value: '22097',
                label: '22097',
            },{
                value: '22099',
                label: '22099',
            }]
            },
            {
            value: '2210',
            label: '2210',
            children: [{
                value: '22101',
                label: '22101',
            },{
                value: '22102',
                label: '22102',
            },{
                value: '22103',
                label: '22103',
            },{
                value: '22104',
                label: '22104',
            },{
                value: '22105',
                label: '22105',
            },{
                value: '22106',
                label: '22106',
            },{
                value: '22107',
                label: '22107',
            },{
                value: '22108',
                label: '22108',
            },{
                value: '22109',
                label: '22109',
            }]
            },
            {
            value: '2211',
            label: '2211',
            children: [{
                value: '22111',
                label: '22111',
            },{
                value: '22112',
                label: '22112',
            },{
                value: '22113',
                label: '22113',
            },{
                value: '22114',
                label: '22114',
            },{
                value: '22115',
                label: '22115',
            },{
                value: '22116',
                label: '22116',
            },{
                value: '22117',
                label: '22117',
            }]
            },
            {
            value: '4398',
            label: '4398',
            children: [{
                value: '43981',
                label: '43981',
            },{
                value: '43986',
                label: '43986',
            },{
                value: '43987',
                label: '43987',
            },{
                value: '43988',
                label: '43988',
            },{
                value: '43989',
                label: '43989',
            }]
            }
        ],
        workDay:'',
        StartTime:'',
        EndTime:'',
        meta: {
            dataSourceList: [
            {
                value: "杭州市",
                label: "杭州市",
            },
            ],
            dataPostman: [
            {
                value: "2210872044685",
                label: "2210872044685",
            },
            ],
            dataIdList: [
            // {
            //   value: "20200423",
            //   label: "2020-04-23",
            // },
            ],
            modelList: [
            {
                name: "greedy_distance",
                version: "1.1.0",
            },
            ],
        },
        showData : {
            rawData:[],
        },
        amapContext: {
            // 地图参数
            map: {
                bounds: null,
                center: [39.990661, 116.473778],
                currentCenter: [39.990661, 116.473778],
                position: [39.990661, 116.473778],
                zoom: 14,
                pitch: 0,
                rotation: 15,
                polyLine: [],
                loadding: false,
            },
            // 地图数据参数
            data: {
                markers: [],
                dealIdx: 1, // 当前业务是哪个deal
                // 轨迹信息
                groudTruth: [],
                predict: [],
            },
        },
      // for bottom
      modelContext: {
        title: "未指定",
        markersTable: [],
        modelIdx: 0,
        predict: [], // mock give grouth
        groudTruthText: [
          {
            location: "120.180503,30.323697",
            address:
              "1浙江省杭州市拱墅区东新街道东方茂商业中心T3新天地购物中心",
          },
        ],
        predictText: [
          {
            timestamp:"",
            location: "120.180503,30.323697",
            address:
              "1浙江省杭州市拱墅区东新街道东方茂商业中心T3新天地购物中心",
            time:"2021-04-01 09:35:46",
          },
        ],
        groundTruthOrder: [],
        predictOrder: [],
        HR_3: "N/A",
        Kendall: "N/A",
        LSD: "N/A",
      },
      // 容器高度
      containerHeight: 0,
      isReplaying: true, // 是否演示轨迹回放
      timer: null,//定时器
    };
},
created() {
},
mounted() {
    window._AMapSecurityConfig = {
      securityJsCode: 'c0d29b49085db6ae32e212447b158dab' // 申请key对应的秘钥
    }
    this.initAMap()
    this.getPostmanID()
},
watch: {
    "amapContext.data.markers" (newMarks,oldMarks){
        // console.log(oldMarks,newMarks);
        // 清除地图上的标记
        this.map.clearMap() 
        if (this.riding !== null) {
            this.riding.clear()
            this.map.remove(this.riding)
            console.log('已清空骑行路线');
        }
        // 设置新的标记
        this.amapContext.data.markers.forEach((marker) => {
            this.setMark(marker)
        });
        this.setMapCenter(this.amapContext.data.markers[0].position)
        this.containerHeight = `58%`
    }
},
methods: {
    initAMap() {
        AMapLoader.load({
            key: "1c9f2d7558480c8c020f14c6de8dc120", //设置高德地图Web端的key
            version: "2.0",
            plugins: ["AMap.ToolBar", "AMap.Driving","AMap.Riding", 'AMap.AutoComplete','AMap.Walking','AMap.MoveAnimation'],
            AMapUI: {
                version: "1.1",
                plugins: [],
            },
            Loca: {
                version: "2.0",
            },
        }).then((AMap) => {
            this.map = new AMap.Map("container", {
                resizeEnable: true,  //是否监控地图容器尺寸变化
                viewMode: "3D",
                center: [120.182375,30.323744],
                zoom: 16,
                zooms: [8, 28]
            });
        }).catch((e) => {
            console.log(e);
        });
    },
    ridingRoute(startPos,endPos){
        var ridingOption = {
            map: this.map,
            // panel: "panel",
            policy: 1,
            hideMarkers: false,
            isOutline: true,
            outlineColor: '#ffeeee',
            autoFitView: true
        }
        this.riding = new AMap.Riding(ridingOption)
        let that = this
        //根据起终点坐标规划骑行路线
        this.riding.search(startPos,endPos, function(status, result) {
            console.log(status, result);
            // result即是对应的骑行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
            if (result.routes && result.routes.length) {
                that.drawRoute(result.routes[0])
                console.log('绘制骑行路线完成')
            }else {
                console.log('骑行路线数据查询失败' + result)
            }
        });
    },
    drawRoute(route) {
        console.log('drawRoute');
        var path = this.parseRouteToPath(route)
        var startMarker = new AMap.Marker({
            position: path[0],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
            anchor: 'bottom-center',
            map: this.map
        })
        var endMarker = new AMap.Marker({
            position: path[path.length - 1],
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
            anchor: 'bottom-center',
            map: this.map
        })
        var routeLine = new AMap.Polyline({
            path: path,
            isOutline: true,
            outlineColor: '#ffeeee',
            borderWeight: 2,
            strokeWeight: 5,
            strokeColor: '#0091ff',
            strokeOpacity: 0.9,
            lineJoin: 'round'
        })
        this.map.add(routeLine);
        // 调整视野达到最佳显示区域
        this.map.setFitView([ startMarker, endMarker, routeLine ])
    },
    parseRouteToPath(route) {
        var path = []
        for (var i = 0, l = route.rides.length; i < l; i++) {
            var step = route.rides[i]
            for (var j = 0, n = step.path.length; j < n; j++) {
              path.push(step.path[j])
            }
        }
        return path
    },
    setMark(marks){ 
        console.log(marks);
        var marker = new AMap.Marker({
            position: marks.position,
            icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
            anchor:'bottom-center',
            offset: new AMap.Pixel(0, 0)
        });
        marker.setMap(this.map);
        // 设置鼠标划过点标记显示的文字提示
        marker.setTitle('快递包裹title');
        // 设置label标签
        // label默认蓝框白底左上角显示，样式className为：amap-marker-label
        marker.setLabel({
            direction:'right',
            offset: new AMap.Pixel(10, 0),  //设置文本标注偏移量
            content: "<div class='info'>快递包裹</div>", //设置文本标注内容
            style:{
                'padding': '.75rem 1.25rem',
                'margin-bottom': '1rem',
                'border-radius': '.25rem',
                'background-color': 'white',
                'width': '10rem',
                'border-width': 0,
                'box-shadow': '0 2px 6px 0 rgba(114, 124, 245, .5)',
                'text-align': 'center',
                'font-size': '20px',
                'color': 'blue'
            },
        });
    },
    // 标记变大变小的函数
    changeMarkerSize() {
        var scale = Math.random() * 0.5 + 0.5; // 随机生成缩放比例
        this.marker.setScale(scale); // 设置标记的缩放比例

        var zoom = Math.random() * 4 + 10; // 随机生成地图缩放级别
        this.map.setZoom(zoom); // 设置地图的缩放级别
    },
    // 定时器，每隔 1 秒更新标记大小和地图缩放级别
    setMapCenter(center){
        // console.log(center);
        this.map.setCenter(center);
    },
    goBackPredictPage(){
      this.$router.push({ path: '/courier_predict' });
    },
    replayingData(){
        this.isReplaying = false
        // 清除地图上的标记
        this.map.clearMap() 
        if (this.riding !== null) {
            this.riding.clear()
            this.map.remove(this.riding)
            console.log('已清空骑行路线');
        }
        console.log('轨迹点回放。。。');
                // 绘制轨迹
        var polyline = new AMap.Polyline({
            map: map,
            path: lineArr,
            showDir:true,
            strokeColor: "#28F",  //线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 6,      //线宽
            // strokeStyle: "solid"  //线样式
        });

        var passedPolyline = new AMap.Polyline({
            map: map,
            strokeColor: "#AF5",  //线颜色
            strokeWeight: 6,      //线宽
        });


        marker.on('moving', function (e) {
            passedPolyline.setPath(e.passedPath);
            map.setCenter(e.target.getPosition(),true)
        });

        map.setFitView();

        window.startAnimation = function startAnimation () {
            marker.moveAlong(lineArr, {
                // 每一段的时长
                duration: 500,//可根据实际采集时间间隔设置
                // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
                autoRotation: true,
            });
        };
    },
    routeDesign() {
        this.isReplaying = true
        // 清除地图上的标记
        this.map.clearMap() 
        if (this.riding !== null) {
            this.riding.clear()
            this.map.remove(this.riding)
            console.log('已清空骑行路线');
        }
        console.log('路线规划。。。');
    },
    handleClose() {
      // 关闭卡片前的处理
    },
    async getPostmanID() {
        this.postmanID = ''
        this.workDay = ''
        this.meta.dataPostman = []
        this.meta.dataIdList = []
        this.showData.rawData = []
        this.containerHeight = `0`
      // console.log(typeof this.$data.postmanIDPrefix[1]);
      let postmanID = [];
      let prefix
      if (this.postmanIDPrefix[1] == undefined) {
        prefix = '0000'
      }else{
        prefix = this.postmanIDPrefix[1]
      }
      try {
        const res = await this.$api.GET_POSTMANID(prefix);
        res.data.forEach((id) => {
          postmanID.push({
            value: id.postman_id,
            label: id.value,
          });
        });
      } catch (error) {
        console.log(error);
        return;
      }
      this.meta.dataPostman = postmanID;
    },
    searchPostData(){
      let dataPostman = this.postmanID
      let dataId = this.dataContext.dataId
      let startTime = this.StartTime
      let endTime = this.EndTime
      let searchID = this.postmanID
      console.log(searchID)
      if (endTime < startTime || endTime == startTime){
        console.log("时间未填写或时间错误")
      }else {
        console.log("时间应该没问题")
      }
    },
    async getPostmanWorkDate() {
      this.workDay = ''
      this.showData.rawData = ''
      let dataIdList = []
      try {
        const res = await this.$api.GET_POSTMAN_WORKDATE(this.$data.postmanID);
        res.data.forEach((id) => {
          dataIdList.push({
            value: id.postman_work_date,
            label: id.value,
          });
        });
      } catch (error) {
        console.log(error);
        return;
      }
      this.meta.dataIdList = dataIdList;
    },
    async setShowData(){
      this.showData.rawData = ''
      this.getPostmanRawData()
    },
    async getPostmanRawData() {
      let postmanRawData = []
      try {
        const res = await this.$api.GET_POSTMAN_RAW_DATA(this.$data.postmanID,this.$data.workDay);
        // console.log(res.data);
        res.data.forEach((id,index) => {
            // console.log(id,index);
            postmanRawData.push({
                dealDate:id.DealDate,
                location: id.DealLongitude + "," + id.DealLatitude,
                lnglat: [+`${parseFloat(id.DealLongitude).toFixed(6)}`,+`${parseFloat(id.DealLatitude).toFixed(6)}`],
                netLnglat: index + 1 != res.data.length ? [+`${parseFloat(res.data[index+1].DealLongitude).toFixed(6)}`,+`${parseFloat(res.data[index+1].DealLatitude).toFixed(6)}`]:[],
                address : '',
                dealTime: id.GetDealTime.substr(10,20),
                dealFinishTime: id.DealFinishTime.substr(10,20),
                appointmentTime: id.AppointmentTimeOne.substr(10,20) + " : " + id.AppointmentTimeTwo.substr(10,20), 
            });
            let latString = id.DealLatitude
            let lngString = id.DealLongitude
            let locations = [lngString-0,latString-0]
            // this.$api.GET_GEO_ENCODING(locations).then(res1=>{
            //     // console.log(res1.regeocode.formatted_address);
            //     if (res1 != null){
            //     postmanRawData[index].address = res1.regeocode.formatted_address
            //     }else{
            //     postmanRawData[index].address = '未知地址'
            //     }
            // })
        });
      } catch (error) {
            console.log(error);
            return;
      }
      this.showData.rawData = postmanRawData;
      let markers = [];
      let markersTable = [];
      // console.log(this.showData.rawData[0].location);
      // console.log(typeof this.showData.rawData[0].location);
      this.showData.rawData.forEach((id,idx) => {
        // console.log(id,idx);
        // console.log(id.address);
        let locationMap = new Map();
        let lnglat = id.location
        let location = lnglat.split(",")
        let ptrKey = location[1] + ":" + location[0]
        let position = [parseFloat(location[0]),parseFloat(location[1])]
        let netPos = []
        if (idx+1 !== this.showData.rawData.length) {
            let v = this.showData.rawData[idx+1].location.split(",")
            netPos = [parseFloat([v[0]]),parseFloat(v[1])]
        } else {
            netPos = position
        }
        if(idx == 0){
            this.$data.amapContext.map.center = position
        }
        // console.log(position);
        let ptr = locationMap.get(ptrKey);
        this.$data.amapContext.data.center = location;
        if (ptr == null) {
          ptr = {
            position: position,
            netPos: netPos,
            latlng: lnglat,
            address: id.address,
            iconShow: this.$data.amapContext.map.markerIcon,
            // innerContent: [{ timeOrder: idx, dealTime: dealTime }],
            innerCount: 1,
          };
          markers.push(ptr);
          locationMap.set(ptrKey, ptr);
        } else {
          // ptr.innerContent.push({ timeOrder: idx, dealTime: dealTime });
          ptr.innerCount += 1;
        }
        // console.log("ptr:",ptr);
      })
    //   console.log(markers);
      this.$data.amapContext.data.markers = markers;
      // deal with  
      this.modelContext.markersTable = markersTable;
    },
    handleChangeCenter(marker){
        console.log(marker);
        let center = marker.location.split(",")
        // let curPos = [parseFloat(center[0]),parseFloat(center[1])]
        this.setMapCenter(marker.lnglat)
        this.ridingRoute(marker.lnglat,marker.netLnglat)
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
    height: 60px;
    background-color: rgba(27, 25, 27, 0.884);
}

.map_title h3 {
    position: absolute;
    left: 20px;
    z-index: 2;
    color: white;
}
.card-container {
  position: fixed;
  top: 100px;
  left: 2%;
  /* transform: translate(-50%, -50%); */
  width: 500px;
  height: 86%;
  z-index: 1;
  opacity: 0.8; 
}

/* 设置卡片容器样式 */
.card-content {
  position: fixed;
  /* top: 100px; */
  left: 2%;
  /* transform: translate(-50%, -50%); */
  width: 500px;
  /* height: 86%; */
  overflow-y: scroll; /* 添加滚动条 */
  scrollbar-width: none; /* 隐藏滚动条 */
  -ms-overflow-style: none; /* 隐藏滚动条（IE） */
  scroll-padding-bottom: 100px; /* 设置底部内边距 */
  z-index: 1;
  opacity: 0.8; 
}
.card-content::-webkit-scrollbar {
    display: none; /* 隐藏滚动条（Chrome、Safari） */
}

/* 设置卡片样式 */
.card-top {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.24);
}
</style>
