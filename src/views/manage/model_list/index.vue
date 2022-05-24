<template>
  <d2-container>
    <template slot="header"><a class="title">模型列表</a></template>
    <!-- 主体列表 -->
    <template>
      <div style="margin-bottom: 10px; width: 600px">
        <el-input placeholder="请输入模型地址" v-model="modelUrl">
          <template slot="prepend">Http://</template>
          <template slot="append">
            <el-button style="" type="success" @click="loadModel()">
              导入</el-button
            >
          </template>
        </el-input>
      </div>
    </template>
    <template>
      <el-card
        class="box-card"
        v-for="(model, idx) in models"
        :models="models"
        :key="model.Name"
      >
        <el-descriptions
          class="margin-top"
          :title="model.modelName"
          :column="4"
          border
        >
          <!-- :size="medium" -->
          <template slot="extra">
            <el-popconfirm
              title="确定卸载该版本模型吗？"
              @confirm="removeModel(idx)"
            >
              <el-button slot="reference" type="danger" size="small">
                卸载该版本
              </el-button>
            </el-popconfirm>
            <!-- <template style="width: 25px"></template> -->
            <el-button
              style="margin-left: 15px"
              @click="detailModel(idx)"
              type="primary"
              size="small"
              >查看实例信息</el-button
            >
            <el-button
              @click="openUpdateDialog(idx)"
              type="primary"
              size="small"
              >调整参数配置</el-button
            >
            <el-button type="primary" size="small">测试一下</el-button>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <!-- <i class="el-icon-user"></i> -->
              模型名
            </template>
            {{ model.modelName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <!-- <i class="el-icon-mobile-phone"></i> -->
              运行版本
            </template>
            {{ model.modelVersion }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <!-- <i class="el-icon-location-outline"></i> -->
              运行环境
            </template>
            <el-tag size="medium">{{ model.runtime }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <!-- <i class="el-icon-location-outline"></i> -->
              模型导入地址
            </template>
            <el-tag size="medium">local</el-tag>
            <a> {{ model.modelUrl }}</a>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <!-- <i class="el-icon-tickets"></i> -->
              模型最小实例数
            </template>
            {{ model.minWorkers }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <!-- <i class="el-icon-tickets"></i> -->
              模型最大实例数
            </template>
            {{ model.maxWorkers }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <!-- <i class="el-icon-tickets"></i> -->
              Batch设置
            </template>
            {{ model.batchSize }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <!-- <i class="el-icon-tickets"></i> -->
              是否在启动时加载
            </template>
            <a v-if="model.loadedAtStartup">是</a>
            <a v-if="!model.loadedAtStartup">否</a>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </template>
    <!-- 右侧实例信息 -->
    <template>
      <el-drawer
        :title="modelDetail.modelDisplayTitle"
        :visible.sync="drawer"
        direction="rtl"
        size="60%"
      >
        <el-card class="box-card">
          <template>
            <el-table
              :data="modelDetail.workers"
              border
              style="width: 90%；height:90px"
            >
              <el-table-column prop="id" label="id" width="100">
              </el-table-column>
              <el-table-column prop="startTime" label="启动时间" width="170">
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
              </el-table-column>
              <el-table-column prop="memoryUsage" label="内存使用" width="100">
              </el-table-column>
              <el-table-column prop="pid" label="进程id(pid)" width="100">
              </el-table-column>
              <el-table-column prop="useGPU" label="是否使用gpu" width="100">
              </el-table-column>
              <el-table-column prop="gpuUsage" label="gpu占用率" width="100">
              </el-table-column>
              <!-- <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                  >查看</el-button
                >
                <el-button type="text" size="small">编辑</el-button>
              </template>
            </el-table-column> -->
            </el-table>
          </template>
        </el-card>
      </el-drawer>
    </template>

    <!-- 更改模型的部署参数提示 -->
    <!-- Form -->
    <!-- <el-button type="text" @click="dialogFormVisible = true"
      >打开嵌套表单的 Dialog</el-button
    > -->

    <el-dialog :title="dialog.title" :visible.sync="dialog.visible">
      <el-form :model="dialog">
        <el-form-item label="最小实例数" label-width="120px">
          <el-input-number
            v-model="dialog.minWorkers"
            :min="0"
            :max="32"
            label="最小实例数"
          ></el-input-number>
          <!-- <el-input v-model="dialog.minWorkers" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="最大实例数" label-width="120px">
          <el-input-number
            v-model="dialog.maxWorkers"
            :min="0"
            :max="32"
            label="最大实例数"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            dialog.visible = false;
            updateModel();
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import modelManageApi from "@/api/modules/model.manage.api";
export default {
  name: "modelList",
  data: function () {
    return {
      modelUrl: "",
      //模型列表页
      models: [
        {
          modelName: "greedy_distance",
          modelVersion: "1.0",
          modelUrl: "greedy_distance.mar",
          runtime: "python3",
          minWorkers: 32,
          maxWorkers: 32,
          batchSize: 1,
          maxBatchDelay: 100,
          loadedAtStartup: false,
          workers: [
            {
              id: "9000",
              startTime: "2021-11-29T07:31:50.801Z",
              status: "READY",
              memoryUsage: 230146048,
              pid: 57,
              gpu: false,
              gpuUsage: "N/A",
            },
          ],
        },
        {
          modelName: "greedy_time",
          modelVersion: "1.0",
          modelUrl: "greedy_distance.mar",
          runtime: "python3",
          minWorkers: 32,
          maxWorkers: 32,
          batchSize: 1,
          maxBatchDelay: 100,
          loadedAtStartup: false,
          workers: [
            {
              id: "9000",
              startTime: "2021-11-29T07:31:50.801Z",
              status: "READY",
              memoryUsage: 230146048,
              pid: 57,
              gpu: false,
              gpuUsage: "N/A",
            },
          ],
        },
      ],
      dialog: {
        visible: false,
        minWorkers: 0,
        maxWorkers: 0,
        title: "",
        modelName: "",
        modelVersion: "",
        idx: -1,
      },
      drawer: false,
      // 用于模型的详情页列表
      modelDetail: {
        modelName: "greedy_time",
        modelVersion: "1.0",
        modelUrl: "greedy_distance.mar",
        runtime: "python3",
        minWorkers: 32,
        maxWorkers: 32,
        batchSize: 1,
        maxBatchDelay: 100,
        loadedAtStartup: false,
        workers: [
          {
            id: "9000",
            startTime: "2021-11-29T07:31:50.801Z",
            status: "READY",
            memoryUsage: 230146048,
            pid: 57,
            gpu: false,
            gpuUsage: "N/A",
          },
        ],
      },
    };
  },
  created: function () {
    this.getModelsData();
  },
  methods: {
    async loadModel() {
      const h = this.$createElement;
      let url = this.$data.modelUrl;
      this.$notify({
        title: "加载模型成功",
        message: h("i", { style: "color: teal" }, url),
      });
    },
    async removeModel(idx) {
      let selectModel = this.$data.models[idx];
      const unregisterModule = await this.$api.UNREGISTER_MODEL(
        selectModel.modelName,
        selectModel.modelVersion
      );
      const h = this.$createElement;
      this.$notify({
        title: "卸载模型",
        message: h(
          "i",
          { style: "color: teal" },
          selectModel.modelName + ":v" + selectModel.modelVersion + " 卸载成功"
        ),
      });
      this.$data.models.splice(idx, 1);
    },
    async getModelsData() {
      let modelList = null;
      try {
        const res = await this.$api.GET_MODEL_DETAIL();
        // console.log(res);
        modelList = res.data.modelStates;
      } catch (error) {
        console.log(error);
        return;
      }
      // console.log(modelList);
      this.$data.models = modelList;
      // console.log("info");
      // console.log(modelInfos);
    },
    async updateModel() {
      let modelName = this.$data.dialog.modelName;
      let modelVersion = this.$data.dialog.modelVersion;
      let minWorkers = this.$data.dialog.minWorkers;
      let maxWorkers = this.$data.dialog.maxWorkers;

      const resp = await this.$api.UPDATE_MODEL(
        modelName,
        modelVersion,
        minWorkers,
        maxWorkers
      );

      // 更新当前表格内容
      for (let i = 0; i < this.$data.models.length; i++) {
        let model = this.$data.models[i];
        if (
          model.modelName === modelName &&
          model.modelVersion == modelVersion
        ) {
          model.minWorkers = minWorkers;
          model.maxWorkers = maxWorkers;
        }
      }

      // 提示
      const h = this.$createElement;
      this.$notify({
        title: "更新模型成功",
        message: h(
          "i",
          { style: "color: teal" },
          modelName + ":v" + modelVersion + " 更新成功"
        ),
      });
    },
    openUpdateDialog(idx) {
      let selectModel = this.$data.models[idx];
      this.$data.dialog.minWorkers = selectModel.minWorkers;
      this.$data.dialog.maxWorkers = selectModel.maxWorkers;
      this.$data.dialog.modelName = selectModel.modelName;
      this.$data.dialog.modelVersion = selectModel.modelVersion;
      this.$data.dialog.idx = idx;
      this.$data.dialog.title =
        "参数配置： " + selectModel.modelName + ":v" + selectModel.modelVersion;
      this.$data.dialog.visible = true;
    },
    detailModel(idx) {
      this.$data.modelDetail = this.$data.models[idx];
      this.$data.modelDetail.modelDisplayTitle =
        this.$data.modelDetail.modelName +
        ": v" +
        this.$data.modelDetail.modelVersion +
        "进程实例信息";
      this.$data.drawer = true;
      this.$data.modelDetail.workers.forEach((worker) => {
        if (worker.gpu) {
          worker.useGPU = "是";
        } else {
          worker.useGPU = "否";
        }
      });
    },
  },
};
</script>
<style>
.title {
  font-size: 22px;
}
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}
.model_state {
  left: 20px;
}
</style>
