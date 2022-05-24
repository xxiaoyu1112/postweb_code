<template>
  <div id="app">
    <d2-container>
      <template slot="header"><a class="title">原始数据信息</a></template>
      <!-- 主体列表 -->
      <el-card style="width: 100%">
        <div style="margin-left: 10px">
          <div class="block">
            <span class="demonstration"> 请选择一批原始数据</span>
            <el-cascader
              style="left: 20px"
              v-model="dataContext.value"
              :options="options"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader>
            <el-button style="margin-left: 40px" type="primary" @click="test"
              >生成预测数据
            </el-button>
            <el-button style="margin-left: 40px" type="danger"
              >删除数据
            </el-button>
          </div>
          <div style="margin-top: 20px">
            <div style="margin-bottom: 40px">
              <h2>数据处理进度: {{ showName }}</h2>
            </div>
            <div>
              <el-steps
                :space="200"
                :active="stepStatus"
                finish-status="success"
              >
                <el-step
                  v-for="step in steps"
                  :key="step.label"
                  :title="step.label"
                  :icon="step.icon"
                ></el-step>
                <!-- <el-step icon="" title="提交任务"></el-step>
                <el-step icon="el-icon-loading" title="预处理数据"></el-step>
                <el-step title="生成预测数据"></el-step>
                <el-step title="持久化到Mongo"></el-step>
                <el-step title="已完成"></el-step> -->
              </el-steps>
            </div>
          </div>
          <div style="margin-top: 40px">
            <div><h2>数据预览</h2></div>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column
                v-for="item in tableHeader"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
              >
              </el-table-column>
            </el-table>
            <div style="margin-top: 10px">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="1000"
                :pager-count="21"
                :current-page.sync="dataContext.pageNum"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </el-card>
    </d2-container>
  </div>
</template>

<script>
export default {
  name: "raw_data",
  data() {
    return {
      dataContext: {
        value: [],
        pageNum: 0,
        pageSize: 7,
      },
      value: [],
      options: [],
      tableData: [],
      tableHeader: [
        { label: "日期", key: "DealDate" },
        { label: "运营区id", key: "RegionId" },
        { label: "城市", key: "City" },
        { label: "快递员id", key: "PostManId" },
        { label: "接单时间", key: "GetDealTime" },
        { label: "预约时间", key: "AppointmentTimeOne" },
       // { label: "预约时间2", key: "AppointmentTimeTwo" },
        { label: "订单经度", key: "DealLongitude" },
        { label: "订单纬度", key: "DealLatitude" },
        { label: "订单所属区块id", key: "DealRegionId" },
        { label: "区块类型id", key: "DealBlockTypeId" },
        { label: "区块类型", key: "DealBlockType" },
        { label: "订单揽收时间", key: "DealFinishTime" },
        // { label: "揽收最近时间", key: "RecentFinishDealTim" },
        // { label: "揽收最近经度", key: "RecentFinishDealLongitude" },
        // { label: "揽收最近纬度", key: "RecentFinishDealLatitude" },
        // { label: "揽收轨迹精度", key: "FinishDealPrecision" },
        // { label: "接单最近时间", key: "RecentGetDealTime" },
        // { label: "接单最近经度", key: "RecentGetDealLongitude" },
        // { label: "接单最近纬度", key: "RecentGetDealLatitude" },
        // { label: "接单轨迹精度", key: "GetDealPrecision" },
      ],
      stepStatus: 0,
      steps: [
        { icon: "", label: "提交任务" },
        { icon: "", label: "预处理数据" },
        { icon: "", label: "生成预测数据" },
        { icon: "", label: "持久化到Mongo" },
        { icon: "", label: "已完成" },
      ],
      // "日期",
      // "运营区id",
      // "城市",
      // "快递员id",
      // "接单时间",
      // "预约时间1",
      // "预约时间2",
      // "订单经度",
      // "订单纬度",
      // "订单所属区块id",
      // "区块类型id",
      // "区块类型",
      // "订单揽收时间",
      // "揽收最近时间",
      // "揽收最近经度",
      // "揽收最近纬度",
      // "揽收轨迹精度",
      // "接单最近时间",
      // "接单最近经度",
      // "接单最近纬度",
      // "接单轨迹精度",
    };
  },
  computed: {
    showName: function () {
      if (this.dataContext.value.length == 0) {
        return "请选择一项原始数据";
      }
      return this.dataContext.value[0] + "-" + this.dataContext.value[2];
    },
  },
  watch: {
    dataContext: {
      handler(val) {
        const source = val.value[1];
        const tag = val.value[2];
        const pageNum = val.pageNum;
        const pageSize = val.pageSize;
        this.getRawData(tag, source, pageSize, pageNum);
        this.loadTaskStatus(tag);
      },
      deep: true,
    },
    stepStatus(val) {
      this.steps.forEach((item) => {
        item.icon = "";
      });
      if (val != 5) {
        this.steps[val].icon = "el-icon-loading";
      }
    },
  },
  mounted() {
    this.getRawDataTree();
  },
  methods: {
    async getRawDataTree() {
      let root = null;
      try {
        const res = await this.$api.GET_RAW_DEAL_TREE();
        root = res.data.Root;
        console.log(root);
      } catch (error) {
        console.log(error);
      }

      function dfsBuildOptionTree(root) {
        let children = [];
        if (root.Child != null && root.Child.length != 0) {
          root.Child.forEach((child) => {
            children.push(dfsBuildOptionTree(child));
          });
        } else {
          children = null;
        }

        let curRoot = {
          label: root.Label,
          value: root.Value,
          children: children,
        };
        return curRoot;
      }
      let optionRoot = dfsBuildOptionTree(root);

      console.log(optionRoot);
      this.$data.options = [optionRoot];
    },
    async getRawData(tag, source, pageSize, pageNum) {
      try {
        const res = await this.$api.GET_RAW_DEAL(
          tag,
          source,
          pageSize,
          pageNum
        );
        console.log(res);
        this.$data.tableData = res.data.RawDatas;
      } catch (error) {
        console.log(error);
      }
    },
    async getTagTaskId(tag) {
      const db = await this.$store.dispatch("d2admin/db/database");
      return db.get(tag);
    },
    async setTagTaskId(tag, taskId) {
      const db = await this.$store.dispatch("d2admin/db/database");
      db.set(tag, taskId).write();
    },
    async genTask(tag) {
      try {
        const res = await this.$api.GEN_PREDICT_DEAL(tag);
        this.setTagTaskId(tag, res.data);
      } catch (error) {
        console.log(error);
      }
    },
    async loadTaskStatus(tag) {
      let result = 0;
      const taskId = await this.getTagTaskId(tag);
      console.log("taskId");
      console.log(taskId);
      if (taskId == null) {
        return result;
      }
      try {
        const res = await this.$api.GET_GEN_TASK(taskId.value());
        result = res.data.Status;
      } catch (error) {
        console.log(error);
      }
      this.stepStatus = result;
    },
    async test() {
      console.log(this.dataContext.value[2]);
      await this.genTask(this.dataContext.value[2]);
    },
  },
};
</script>

<style>
.amap-wrapper {
  width: 500px;
  height: 500px;
}
</style>