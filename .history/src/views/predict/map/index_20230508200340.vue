<!DOCTYPE html>
<html>
<head>
  <title>Vue.js and AMap API Map Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
  <script src="https://webapi.amap.com/maps?v=1.4.15&key=YOUR_AMAP_API_KEY"></script>
  <style>
    #map-container {
      height: 500px;
      width: 100%;
    }
  </style>
</head>
<body>
  <div id="app">
    <div id="map-container"></div>
  </div>
  <script>
    var app = new Vue({
      el: '#app',
      mounted() {
        this.initMap();
      },
      methods: {
        initMap() {
          // 创建地图实例
          var map = new AMap.Map('map-container', {
            zoom: 10,
            center: [116.397428, 39.90923]
          });
          // 添加标记点
          var marker = new AMap.Marker({
            position: [116.397428, 39.90923],
            map: map
          });
        }
      }
    });
  </script>
</body>
</html>