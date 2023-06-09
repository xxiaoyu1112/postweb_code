<template>
  <d2-container>
    <template slot="header">快递员揽件预测演示平台</template>
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
            <v-polyline-decorator
              :paths="[amapContext.data.predict]"
              :patterns="amapContext.map.pattens"
            ></v-polyline-decorator>
            <!-- 预测数据的路线 -->
            <v-polyline
              :opacity="0.5"
              :latLngs="amapContext.data.predict"
            ></v-polyline>
            <!-- 底部标签  -->
            <l-control
              :position="'bottomleft'"
              class="control-watermark"
            >
              预测路径
            </l-control>
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
          <l-map
            ref="groudTruthMap"
            :zoom="amapContext.map.zoom"
            :center="amapContext.map.center"
            :bounds="amapContext.map.bounds"
            style="margin-left: 20px;"
          >
            <!-- 地图 -->
            <l-tile-layer
              :url="amapContext.map.url"
              :attribution="amapContext.map.attribution"
            ></l-tile-layer>
            <!-- 真实数据的箭头 -->
            <v-polyline-decorator
              :paths="[amapContext.data.groudTruth]"
              :patterns="amapContext.map.pattens"
            ></v-polyline-decorator>
            <!-- 真实数据的路线 -->
            <v-polyline
              :opacity="0.5"
              :latLngs="amapContext.data.groudTruth"
            ></v-polyline>
            <!-- 底部标签  -->
            <l-control
              :position="'bottomleft'"
              class="control-watermark"
            >
              真实路径
            </l-control>
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
                真实结果
                <div />
                该位置一共存在{{ marker.innerCount }}个订单
                <div />
                经纬度:{{ marker.latlng }}
                <div />
                地址: {{ marker.address }}
              </l-popup>
            </l-marker>
          </l-map>
        </el-container>
      </el-aside>

      <!--  右侧表格  -->
      <el-main style="margin-left: 20px; padding: 0px;">
        <el-card style="padding: 0px;">
          <div style="padding: 10px;">
            <div style="padding-top: 10px; padding-left: 10px">
              城市：
              <el-select
                v-model="dataContext.dataSource"
                size="mini"
                style="width: 85px"
                placeholder="上海市"
              >
                <el-option
                  v-for="item in meta.dataSourceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  size="mini"
                >
                </el-option>
              </el-select>
              <a style="padding-left: 20px">日期： </a>
              <el-select
                v-model="dataContext.dataId"
                size="mini"
                style="width: 110px"
              >
                <el-option
                  v-for="item in meta.dataIdList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  size="mini"
                >
                </el-option>
              </el-select>
            </div>
            <el-divider></el-divider>
            <div>
              <el-table :data="dataContext.dataList" stripe style="width: 100%">
                <el-table-column prop="id" label="序号" align="center"> </el-table-column>
                <el-table-column prop="region" label="地区" align="center"> </el-table-column>
                <el-table-column prop="Length" label="长度" style="width: 50px" align="center">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      @click="setDataToMap(scope.row)"
                      type="text"
                      size="small"
                      >预测
                    </el-button>

<!--                    <el-button type="text" size="small">预测</el-button>  -->
                  </template>
                </el-table-column>
              </el-table>
              <div>
                <el-pagination
                  :page-size="dataContext.pageSize"
                  :current-page.sync="dataContext.pageNum"
                  :pager-count="5"
                  layout="prev, pager, next"
                  :total="47000"
                >
                </el-pagination>
              </div>
            </div>
          </div>
        </el-card>
      </el-main>
    </el-container>
    <!-- 底部 -->
    <el-container style="margin-top: 20px">
      <el-card style="width: 100%">
        <div style="margin-top: 5px; margin-left: 20px">
          <div>
            <el-collapse>
              <el-collapse-item
                v-if="dataContext.dataList[amapContext.data.dealIdx] != null"
                :title="'当前揽件数据:' + modelContext.title"
                name="2"
              >
                <div style="margin-left: 12px; margin-top: 20px">
                  当前揽件数据id:
                  <a style="margin-left: 30px">
                    {{ modelContext.title }}
                  </a>
                  <el-table
                    :data="modelContext.markersTable"
                    style="margin-top: 20px; width: 100%"
                    border
                  >
                    <el-table-column
                      prop="timeIdx"
                      label="下单顺序"
                      width="100"
                    >
                    </el-table-column>
                    <el-table-column prop="location" label="经纬度">
                    </el-table-column>
                    <el-table-column prop="address" label="地址">
                    </el-table-column>
                    <el-table-column prop="dealTime" label="时间">
                    </el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <el-divider></el-divider>
          <div style="margin-top: 20px">
            <el-row style="margin-top: 20px">
              <el-col :span="5">
                <a> 预测模型:</a>
                <el-select
                  v-model="modelContext.modelIdx"
                  placeholder="请选择一个模型"
                  filterable
                  style="left: 10px"
                  size="small"
                >
                  <el-option
                    v-for="(model, idx) in meta.modelList"
                    :key="idx"
                    :label="model.display"
                    :value="idx"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="1">
                <!-- <el-button
                  style="marigin-left: 50px"
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  >预测</el-button
                > -->
              </el-col>
            </el-row>
          </div>

          <div style="margin-top: 25px">
            <el-row>
              <el-col :span="12">
                <a>预测结果:</a>
                <el-timeline style="margin-left: 100px; margin-top: 15px">
                  <el-timeline-item
                    v-for="(marker, idx) in modelContext.predictText"
                    :key="idx"
                  >
                    经纬度:{{ marker.location }}
                    <div />
                    地址:{{ marker.address }}
                  </el-timeline-item>
                  <!-- <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.timestamp"
                  >
                    {{ activity.content }}
                  </el-timeline-item> -->
                </el-timeline>
              </el-col>

              <el-col :span="12">
                <a>快递员真实揽件路径 :</a>
                <el-timeline style="margin-left: 100px; margin-top: 15px">
                  <el-timeline-item
                    v-for="(marker, idx) in modelContext.groudTruthText"
                    :key="idx"
                  >
                    经纬度:{{ marker.location }}
                    <div />
                    地址:{{ marker.address }}
                  </el-timeline-item>
                  <!-- <el-timeline-item
                    v-for="(activity, index) in activities"
                    :key="index"
                    :timestamp="activity.timestamp"
                  >
                    {{ activity.content }}
                  </el-timeline-item> -->
                </el-timeline>
              </el-col>
            </el-row>
            <el-row style="width: 900px">
              <el-descriptions
                class="margin-top"
                title="评价指标"
                :column="3"
                border
              >
                <el-descriptions-item label="前三点命中个数">{{
                  modelContext.HR_3
                }}</el-descriptions-item>
                <el-descriptions-item label="肯德尔系数">{{
                  modelContext.Kendall
                }}</el-descriptions-item>
                <el-descriptions-item label="LSD">{{
                  modelContext.LSD
                }}</el-descriptions-item>
              </el-descriptions>
            </el-row>
          </div>
        </div>
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
import { address } from "faker/lib/locales/zh_CN";

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
        dataIdList: [
          {
            value: "20200423",
            label: "2020-04-23",
          },
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
            location: "120.180503,30.323697",
            address:
              "1浙江省杭州市拱墅区东新街道东方茂商业中心T3新天地购物中心",
          },
        ],
        groundTruthOrder: [],
        predictOrder: [],
        HR_3: "N/A",
        Kendall: "N/A",
        LSD: "N/A",
      },
    };
  },
  watch: {
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
  },
  mounted: function () {
    this.getData();
    this.getModelList();
    this.$nextTick(function () {
      this.changeDealIdx(0);
    });
  },
  methods: {
    async getOrderText(curIdx, order) {
      let curDeal = this.$data.dataContext.dataList[curIdx];
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
          address: addresses[order].regeocode.formatted_address,
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
      // console.log(predictOrder);
      const predictText = await this.getOrderText(curIdx, predictOrder);
      // console.log(predictText);
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

      const locations = currentDeal.Points.map((point) => {
        let lng = point["features"][2];
        let lat = point["features"][1];
        return [lat, lng];
      });
      // 此方法是异步回调
      const addresses = await this.$api.GET_GEO_ENCODINGS(locations);
      // 反向注册到原来的数据上
      currentDeal.addresses = addresses;
      this.$data.dataContext.dataList[curIdx] = currentDeal;
      // 需要过滤一下重复点
      currentDeal.Points.forEach((point, idx) => {
        console.log("addresses[idx].regeocode:",addresses[idx].regeocode)
        let lng = point["features"][2];
        let lat = point["features"][1];
        let address = addresses[idx].regeocode.formatted_address;
        let dealTime = point["features"][0];
        bounds.lngMax = Math.max(bounds.lngMax, lng);
        bounds.lngMin = Math.min(bounds.lngMin, lng);
        bounds.latMax = Math.max(bounds.latMax, lat);
        bounds.latMin = Math.min(bounds.latMin, lat);
        let ptrKey = lng.toString() + ":" + lat.toString();
        let ptr = locationMap.get(ptrKey);
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
