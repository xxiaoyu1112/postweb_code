<template>
  <d2-container>
    <template slot="header">快递员揽件预测演示平台</template>
    <el-button type="primary" icon="" @click="gotoMapPage">地图</el-button>
    <el-container style="height: 650px">
      <!-- 地图 -->
      <el-aside style="width: 65%;">
        <el-container
          style="width: 100%; height: 100%;"
          v-loading="amapContext.map.loadding"
        >
          <l-map
            ref="predictMap"
            :zoom="amapContext.map.zoom"
            :center="amapContext.map.center"
            :bounds="amapContext.map.bounds"
          >
            <!-- 地图 -->
            <l-tile-layer
              :url="amapContext.map.url"
              :attribution="amapContext.map.attribution"
            ></l-tile-layer>
            <!-- 预测数据的箭头 -->
            <!-- <v-polyline-decorator
              :paths="[amapContext.data.predict]"
              :patterns="amapContext.map.pattens"
            ></v-polyline-decorator> -->
            <!-- 预测数据的路线 -->
            <!-- <v-polyline
              :opacity="0.5"
              :latLngs="amapContext.data.predict"
            ></v-polyline> -->
            <!-- 标记 -->
            <l-marker
              ref="markers"
              v-for="(marker, idx) in amapContext.data.markers"
              :key="idx"
              :lat-lng="marker.position"
              :icon="marker.iconShow"
            >
              <l-popup
                ref="popups"
                :option="{
                  minWidth: 60,
                }"
              >
                预测结果
                <div />
                该位置一共存在{{ marker.innerCount }}个订单
                <div />
                经纬度:{{ marker.latlng }}
                <div />
                地址: {{ marker.address }}
              </l-popup>
            </l-marker>
            <!-- <l-marker :lat-lng="[39.996356, 116.480639]"></l-marker> -->
          </l-map>
        </el-container>
      </el-aside>

      <!--  右侧表格  -->
      <el-main style="margin-left: 20px; padding: 0px;">
        <el-card style="padding: 0px;">
          <div style="padding: 10px;">
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
                v-model="wordkDay"
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
              <!-- <a style="padding-left: 12px">时间段： </a>
              <el-time-select
                v-model="StartTime"
                :picker-options="{start: '07:00',step: '01:00',end: '18:00'}"
                placeholder="选择时间"
                style="width: 120px"
                size="medium"
                >
              </el-time-select>
              --
              <el-time-select
                v-model="EndTime"
                :picker-options="{start: '07:00',step: '01:00',end: '18:00'}"
                placeholder="选择时间"
                style="width: 120px"
                size="medium"
                >
              </el-time-select>
              <br>
              <br> -->
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
            <el-divider></el-divider>
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
      </el-main>
    </el-container>

    <!-- 底部 -->
    <el-container style="margin-top: 20px">
      <el-card style="width: 100%">

      </el-card>
    </el-container>
  </d2-container>
</template>

<script>
import MathUtil from "@/libs/util.math.js";
import L from "leaflet";

import { latLngBounds  } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LPolyline,
  LControl
} from "vue2-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Vue2LeafletPolylinedecorator from "vue2-leaflet-polylinedecorator";
import log from "@/plugin/log";
import { get } from "js-cookie";

let vm;
export default vm = {
  name: "predict",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LControl,
    "v-polyline": LPolyline,
    "v-polyline-decorator": Vue2LeafletPolylinedecorator,
  },
  data: function () {
    // for sidebar left
    return {
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
      wordkDay:'',
      StartTime:'',
      EndTime:'',
      latlngs1: [
        L.latLng(30.326841, 120.184811),
        L.latLng(30.317802, 120.166186),
      ],
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
          markerIcon: L.icon({
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconSize: [30, 50], // size of the icon
            shadowSize: [50, 64], // size of the shadow
            iconAnchor: [15, 50], // point of the icon which will correspond to marker's location
            shadowAnchor: [15, 64], // the same for the shadow
            popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
          }),
          attribution:
            '&copy; <a target="_blank" >INSIS</a> contributors',
          url: "http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
          pattens: [
            {
              offset: 0,
              repeat: 30,
              symbol: L.Symbol.arrowHead({
                pixelSize: 10,
                polygon: false,
                pathOptions: {
                  stroke: true,
                },
              }),
            },
          ],
        },
        // 地图数据参数
        data: {
          markers: [
            // {
            //   position: [39.995839, 116.477646],
            //   proto: {
            //     position: [39.995839, 116.477646],
            //     id: "1",
            //   },
            //   iconShow: L.icon({
            //     iconUrl: icon,
            //     shadowUrl: iconShadow,
            //     iconSize: [30, 50], // size of the icon
            //     shadowSize: [50, 64], // size of the shadow
            //     iconAnchor: [15, 50], // point of the icon which will correspond to marker's location
            //     shadowAnchor: [15, 64], // the same for the shadow
            //     popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
            //   }),
            // },
          ],
          dealIdx: 1, // 当前业务是哪个deal
          // 轨迹信息
          groudTruth: [],
          predict: [],
        },
      },
      // for right main
      dataContext: {
        // 数据源
        dataSource: "杭州市",
        dataPostman:"2210872044685",
        dataId: "20200423",
        pageNum: 1,
        pageSize: 8,
        // 数据
        dataList: [
          {
            id: 0,
            idx: 0,
            start: 1,
            Order: [2, 4, 6, 1, 0, 3, 5],
            Points: [
              {
                features: [
                  463.1333333333333, 120.180503, 30.323697, 5,
                  2.019472122917776, 118, 196.86666666666667,
                  44.950000000000045,
                ],
              },
              {
                features: [
                  483.23333333333335, 120.179383, 30.322905, 5,
                  2.122157146116985, 124, 176.76666666666665,
                  44.950000000000045,
                ],
              },
              {
                features: [
                  467.8333333333333, 120.181946, 30.323814, 5,
                  4.312770974366775, 252, 192.16666666666669,
                  44.950000000000045,
                ],
              },
              {
                features: [
                  -972.4166666666669, 120.18648600000002, 30.325317, 5,
                  12.014147714307446, 702, 1632.416666666667,
                  44.950000000000045,
                ],
              },
              {
                features: [
                  -972.4166666666669, 120.18648600000002, 30.325317, 5,
                  12.014147714307446, 702, 1632.416666666667,
                  44.950000000000045,
                ],
              },
              {
                features: [
                  -972.4166666666669, 120.18648600000002, 30.325317, 5,
                  12.014147714307446, 702, 1632.416666666667,
                  44.950000000000045,
                ],
              },
              {
                features: [
                  -972.4166666666669, 120.18648600000002, 30.325317, 5,
                  12.014147714307446, 702, 1632.416666666667,
                  44.950000000000045,
                ],
              },
            ],
            Length: 7,
          },
        ],
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
      showData : {
        rawData:[],
      },
      address:'',
    };
  },
  watch: {
    "amapContext.map.center"(oldCenter,currentCenter){
      // console.log(oldCenter,currentCenter);
    },
    // 城市
    "dataContext.dataSource"(dataSource, older) {
      this.getData();
      this.amapContext.data.dealIdx = 0;
    },
    // 日期
    "dataContext.dataId"(dataId, older) {
      this.getData();
      this.amapContext.data.dealIdx = 0;
    },

    async "amapContext.data.dealIdx"(curIdx, preIdx) {
      this.changeDealIdx(curIdx);
    },

    async "dataContext.pageNum"(curNum, preNum) {
      // console.log(curNum);
      this.getData();
      this.changeDealIdx(0);
    },

    async "modelContext.modelIdx"(curIdx, preIdx) {
      this.setPredictText(this.amapContext.data.dealIdx);
      console.log("in");
      // console.log(curNum);
      // this.getData();
      // this.changeDealIdx(0);
    },
    async "showData.rawData"(curData,oldData){
      console.log(curData);
    }
  },
  mounted: function () {
    this.getData();
    this.getModelList();
    this.$nextTick(function () {
      this.changeDealIdx(0);
    });
    this.getPostmanID();
    this.getPostmanShowData()
  },
  methods: {
    gotoMapPage() {
      this.$router.push({ path: '/map' });
    },
    async getPostmanShowData(){
      console.log(this.showData.rawData);
    },
    async getlocations(lng,lat){
      let loc = []
      this.$api.GET_GEO_ENCODING([lng-0,lat-0]).then(res=>{
        loc.location = res.regeocode.formatted_address
      })
      return loc
    },
    async getPostmanRawData() {
      let postmanRawData = []
      try {
        const res = await this.$api.GET_POSTMAN_RAW_DATA(this.$data.postmanID,this.$data.wordkDay);
        // console.log(res.data);
        res.data.forEach((id,index) => {
          postmanRawData.push({
            dealDate:id.DealDate,
            location: id.DealLongitude + "," + id.DealLatitude,
            address : '',
            dealTime: id.GetDealTime.substr(10,20),
            dealFinishTime: id.DealFinishTime.substr(10,20),
            appointmentTime: id.AppointmentTimeOne.substr(10,20) + " : " + id.AppointmentTimeTwo.substr(10,20), 
          });
          let latString = id.DealLatitude
          let lngString = id.DealLongitude
          let locations = [lngString-0,latString-0]
          this.$api.GET_GEO_ENCODING(locations).then(res1=>{
            // console.log(res1.regeocode.formatted_address);
            if (res1 != null){
              postmanRawData[index].address = res1.regeocode.formatted_address
            }else{
              postmanRawData[index].address = '未知地址'
            }
          })
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
        // console.log(id);
        // console.log(id.address);
        let locationMap = new Map();
        let lnglat = id.location
        let location = lnglat.split(",")
        let ptrKey = location[1] + ":" + location[0]
        let position = [parseFloat([location[1]]),parseFloat(location[0])]
        if(idx == 0){
          this.$data.amapContext.map.center = position
        }
        // console.log(position);
        let ptr = locationMap.get(ptrKey);
        this.$data.amapContext.data.center = location;
        if (ptr == null) {
          ptr = {
            position: position,
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
      this.$data.amapContext.data.markers = markers;
      // deal with  
      this.modelContext.markersTable = markersTable;
    },
    async setShowData(){
      this.showData.rawData = ''
      this.getPostmanRawData()
    },
    async getPostmanWorkDate() {
      this.wordkDay = ''
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
    async getPostmanID() {
      // console.log(typeof this.$data.postmanIDPrefix[1]);
      let postmanID = [];
      let prefix
      if (this.$data.postmanIDPrefix[1] == undefined) {
        prefix = '0000'
      }else{
        prefix = this.$data.postmanIDPrefix[1]
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
    handleChangeCenter(marker){
      // console.log(marker.location)
      // console.log(this.amapContext.map.center)
    },
    async getOrderText(curIdx, order) {
      let curDeal = this.$data.dataContext.dataList[curIdx];
      console.log("curDeal:",curDeal);
      const addresses = curDeal.addresses;
      const Points = curDeal.Points;
      const orders = order;
      let orderText = [];
      orders.forEach((order) => {
        // let idx = order - 1;
        // console.log(addresses[order]);
        orderText.push({
          location:
            Points[order]["features"][1].toString() +
            "," +
            Points[order]["features"][2].toString(),
          // address: addresses[order].regeocode.formatted_address,
        });
      });
      return orderText;
    },
    async setGroudTruthText(curIdx) {
      const orders = this.$data.dataContext.dataList[curIdx].Order;
      this.$data.modelContext.groundTruthOrder = orders;
      const orderText = await this.getOrderText(curIdx, orders);
      this.modelContext.groudTruthText = orderText;
      const groundTruthLatLng = await this.getLatlngs(curIdx, orders);
      this.amapContext.data.groudTruth = groundTruthLatLng;
    },

    async setRank(predict) {
      const curIdx = this.$data.amapContext.data.dealIdx;
      const truth = this.$data.dataContext.dataList[curIdx].Order;
      // console.log("setRank real:", truth);
      // console.log("setRank predict:", predict);
      if (
        predict.length == 0 ||
        truth.length == 0 ||
        truth.length != predict.length
      ) {
        return;
      }

      const length = predict.length;
      let bot = 0.0;
      let top = 0.0;
      // HR3
      bot = 0.0;
      top = 0.0;
      for (let i = 1; i < length && i < 4; i++) {
        if (predict[i] == truth[i]) {
          top++;
        }
        bot++;
      }
      const HR_3 = ((top * 100) / bot).toFixed(2) + "%";
      // LSD
      top = 0.0;
      bot = length;
      let index_of_predict = new Array(length);
      let index_of_truth = new Array(length);
      for (let i = 0; i < length; i++) {
        index_of_predict[predict[i]] = i;
        index_of_truth[truth[i]] = i;
      }
      for (let i = 0; i < length; i++) {
        let omega = 1 / (index_of_truth[i] + 1);
        let dis = Math.abs(index_of_predict[i] - index_of_truth[i]);
        top += dis * dis * omega;
      }
      const LSD = (top / bot).toFixed(2);
      // Kendall
      top = 0.0;
      bot = ((length - 1) * length) / 2.0;
      let pair = new Map();
      for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
          let key = truth[i].toString() + ":" + truth[j].toString();
          pair.set(key, true);
        }
      }
      for (let i = 0; i < length; i++) {
        for (let j = i + 1; j < length; j++) {
          let key = predict[i].toString() + ":" + predict[j].toString();
          if (pair.has(key)) {
            top++;
          } else {
            top--;
          }
        }
      }
      const Kendall = (top / bot).toFixed(2);
      this.$data.modelContext.LSD = LSD;
      this.$data.modelContext.Kendall = Kendall;
      this.$data.modelContext.HR_3 = HR_3;
    },
    async getLatlngs(curIdx, orders) {
      const curDeal = this.$data.dataContext.dataList[curIdx];
      const points = curDeal.Points;
      let latlngs = [];
      orders.forEach((order) => {
        const point = points[order];
        latlngs.push([point["features"][2], point["features"][1]]);
      });
      return latlngs;
    },
    async setPredictText(curIdx) {
      const predictOrder = await this.getPredictOrder(curIdx);
      this.$data.modelContext.predictOrder = predictOrder;
      console.log("predictOrder:",predictOrder);
      const predictText = await this.getOrderText(curIdx, predictOrder);
      console.log("predictText:",predictText);
      this.modelContext.predictText = predictText;
      const groundTruthLatLng = await this.getLatlngs(curIdx, predictOrder);
      this.amapContext.data.predict = groundTruthLatLng;
      await this.setRank(predictOrder);
    },
    async setOrderText(curIdx) {
      this.setGroudTruthText(curIdx);
      this.setPredictText(curIdx);
    },
    async getPredictOrder(curIdx) {
      const curDeal = this.$data.dataContext.dataList[curIdx];
      const points = curDeal.Points;
      let feature = [];
      const start = curDeal.Start;
      const { name, version } =
        this.$data.meta.modelList[this.$data.modelContext.modelIdx];
      points.forEach((point) => {
        feature.push(point["features"]);
      });
      let predictOrder = [];
      try {
        const res = await this.$api.PREDICT_MODEL(
          name,
          version,
          start,
          feature
        );
        predictOrder = res.data.order;
      } catch (error) {
        console.log(error);
        return predictOrder;
      }
      return predictOrder;
    },
    async changeDealIdx(curIdx) {
      // convert Current Info To Map markers
      this.$data.amapContext.map.loadding = true;
      let currentDeal = this.$data.dataContext.dataList[curIdx];
      // 排序
      this.convertOrderByTimeAsc(currentDeal);
      // deal with markers
      let markers = [];
      let markersTable = [];
      let bounds = {
        lngMax: currentDeal.Points[0]["features"][2],
        lngMin: currentDeal.Points[0]["features"][2],
        latMax: currentDeal.Points[0]["features"][1],
        latMin: currentDeal.Points[0]["features"][1],
      };
      let locationMap = new Map();
      console.log("currentDeal:",currentDeal);
      const locations = currentDeal.Points.map((point) => {
        let lng = point["features"][2];
        let lat = point["features"][1];
        return [lat, lng];
      });
      console.log("locations:",locations);
      // 此方法是异步回调
      const addresses = await this.$api.GET_GEO_ENCODINGS(locations);
      // 反向注册到原来的数据上
      currentDeal.addresses = addresses;
      console.log("currentDeal:",currentDeal);
      this.$data.dataContext.dataList[curIdx] = currentDeal;
      // 需要过滤一下重复点
      currentDeal.Points.forEach((point, idx) => {
        let lng = point["features"][2];
        let lat = point["features"][1];
        // let address = addresses[idx].regeocode.formatted_address;
        let address
        let dealTime = point["features"][0];
        bounds.lngMax = Math.max(bounds.lngMax, lng);
        bounds.lngMin = Math.min(bounds.lngMin, lng);
        bounds.latMax = Math.max(bounds.latMax, lat);
        bounds.latMin = Math.min(bounds.latMin, lat);
        let ptrKey = lng.toString() + ":" + lat.toString();
        let ptr = locationMap.get(ptrKey);
        // console.log([lng, lat]);
        if (ptr == null) {
          ptr = {
            position: [lng, lat],
            latlng: lat.toString() + "," + lng,
            address: address,
            // proto: point,
            iconShow: this.$data.amapContext.map.markerIcon,
            innerContent: [{ timeOrder: idx, dealTime: dealTime }],
            innerCount: 1,
          };
          markers.push(ptr);
          locationMap.set(ptrKey, ptr);
        } else {
          ptr.innerContent.push({ timeOrder: idx, dealTime: dealTime });
          ptr.innerCount += 1;
        }
        markersTable.push({
          location: lat.toString() + "," + lng,
          address: address,
          timeIdx: idx,
          dealTime: dealTime,
        });
        idx++;
      });

      this.$data.amapContext.map.bounds = latLngBounds([
        [bounds.lngMax, bounds.latMax],
        [bounds.lngMin, bounds.latMin],
      ]);
      this.$data.amapContext.data.markers = markers;
      // deal with
      this.modelContext.markersTable = markersTable;
      await this.setOrderText(curIdx);
      if (
        this.$data.dataContext.dataList[this.$data.amapContext.data.dealIdx] !=
        undefined
      ) {
        this.$data.modelContext.title =
          this.$data.dataContext.dataList[
            this.$data.amapContext.data.dealIdx
          ].id.toString();
      }

      this.$data.amapContext.map.loadding = false;
    },
    async getData() {
      const res = await this.$api.GET_DEALS(
        this.$data.dataContext.dataSource,
        this.$data.dataContext.dataId,
        this.$data.dataContext.pageNum,
        this.$data.dataContext.pageSize
      );
      // console.log("in");
      // console.log(res);
      let deals = res.data.PredictDeals;
      deals = deals.map((deal) => {
        deal.Order = deal.Order.map((point) => {
          return point - 1;
        });
        deal.Start = deal.Start - 1;
        return deal;
      });
      // console.log(deals);
      let idx = 0;
      deals.forEach((element) => {
        // element.region = "杭州"; // 静态数据来自于杭州
        element.id = (
          (this.$data.dataContext.pageNum - 1) *
            this.$data.dataContext.pageSize +
          idx
        ).toString();
        element.idx = idx;
        idx++;
      });
      this.$data.dataContext.dataList = deals;
    },
    async getModelList() {
      let modelList = [];
      try {
        const res = await this.$api.GET_MODEL_DETAIL();
        // console.log(res);
        res.data.modelStates.forEach((model) => {
          modelList.push({
            name: model.modelName,
            version: model.modelVersion,
            display: model.modelName + ": " + model.modelVersion,
          });
        });
        // modelList = res.data.modelStates;
      } catch (error) {
        console.log(error);
        return;
      }
      this.meta.modelList = modelList;
    },
    // 把信息保存到地图数据中,watch地图数据就会自动绘画
    // 点击绘制按钮会触发
    setDataToMap(deal) {
      this.$data.amapContext.data.dealIdx = deal.idx;
    },
    convertOrderByTimeAsc(currentDeal) {
      // if (currentDeal.done ===true)
      //     return
      // currentDeal.done = true
      // convert to current Index
      let index = MathUtil.argSort(currentDeal.Points, (a, b) => {
        return a[0] - b[0];
      }); //

      // currentDeal.Order = currentDeal.Order.map((item) => {
      //   return item - 1;
      // });
      let points = [];
      let Order = [];
      let start = 0;
      let oldToNew = new Map();
      index.forEach((oldIdx, newIdx) => {
        if (oldIdx == currentDeal.start) {
          start = newIdx;
        }
        points.push(currentDeal.Points[oldIdx]);
        oldToNew.set(oldIdx, newIdx);
      });
      currentDeal.Order.forEach((ptr) => {
        Order.push(oldToNew.get(ptr));
      });
      currentDeal.Points = points;
      currentDeal.start = start;
      currentDeal.Order = currentDeal.Order;
    },
  },
};
</script>
<style >
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.left-box-card {
  width: 72%;
  background-color: aqua;
}
.left_region {
  width: 72%;
}

.right-region {
  width: 28%;
}
.right-box-card {
  width: 22%;
  background-color: rebeccapurple;
}
.control-watermark {
  font-size: 200%;
  font-weight: bolder;
  color: #000000;
  text-shadow: #555;
}
</style>
<style lang="scss">
@import "~leaflet/dist/leaflet.css";
</style>
