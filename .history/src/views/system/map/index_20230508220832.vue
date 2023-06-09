<template>
    <div>
        <div id="container" style="position: relative;width: 100%; height:100%;"></div>
        <div class="input-card">
            <h4>轨迹回放控制</h4>
            <div class="input-item">
                <input type="button" class="btn" value="开始动画" id="start" onclick="startAnimation()"/>
                <input type="button" class="btn" value="暂停动画" id="pause" onclick="pauseAnimation()"/>
            </div>
            <div class="input-item">
                <input type="button" class="btn" value="继续动画" id="resume" onclick="resumeAnimation()"/>
                <input type="button" class="btn" value="停止动画" id="stop" onclick="stopAnimation()"/>
            </div>
        </div>
    </div>
</template>
    
<script>
    import MapLoader from '../../../assets/amap'

    export default {
        name: 'Amap',
        data () {
        return {
            map: '',
        }
        },
        mounted() {
            this.initAMap()
        },
      methods: {
          initAMap () {
            let that = this
            MapLoader().then(AMap => {
              that.map = new AMap.Map('container', {
                zoom: 11, // 级别
                center: [116.397428, 39.90923], // 中心点坐标
                viewMode:'3D' // 使用3D视图
              })
                  // JSAPI2.0 使用覆盖物动画必须先加载动画插件
                AMap.plugin('AMap.MoveAnimation', function(){
                    var marker, lineArr = [[116.478935,39.997761],[116.478939,39.997825],[116.478912,39.998549],[116.478912,39.998549],[116.478998,39.998555],[116.478998,39.998555],[116.479282,39.99856],[116.479658,39.998528],[116.480151,39.998453],[116.480784,39.998302],[116.480784,39.998302],[116.481149,39.998184],[116.481573,39.997997],[116.481863,39.997846],[116.482072,39.997718],[116.482362,39.997718],[116.483633,39.998935],[116.48367,39.998968],[116.484648,39.999861]];

                    var map = new AMap.Map("container", {
                        resizeEnable: true,
                        center: [116.397428, 39.90923],
                        zoom: 17
                    });

                    marker = new AMap.Marker({
                        map: map,
                        position: [116.478935,39.997761],
                        icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
                        offset: new AMap.Pixel(-13, -26),
                    });

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

                    window.pauseAnimation = function () {
                        marker.pauseMove();
                    };

                    window.resumeAnimation = function () {
                        marker.resumeMove();
                    };

                    window.stopAnimation = function () {
                        marker.stopMove();
                    };
                });
              // 异步加载插件
              // AMap.ToolBar: 滑动工具条， AMap.Scale: 比例尺
              // 一次加载多个
              AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], function () {
                that.map.addControl(new AMap.ToolBar())
                that.map.addControl(new AMap.Scale())
              })
              // AMap.Geolocation: 定位
              AMap.plugin('AMap.Geolocation', function () {
               let geolocation = new AMap.Geolocation({
                 enableHighAccuracy: true, //是否使用高精度定位，默认:true
                 timeout: 10000,           //超过10秒后停止定位，默认：无穷大
                 maximumAge: 0,            //定位结果缓存0毫秒，默认：0
                 convert: true,            //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                 showButton: true,         //显示定位按钮，默认：true
                 buttonPosition: 'LB',     //定位按钮停靠位置，默认：'LB'，左下角
                 buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                 showMarker: true,         //定位成功后在定位到的位置显示点标记，默认：true
                 showCircle: true,         //定位成功后用圆圈表示定位精度范围，默认：true
                 panToLocation: true,      //定位成功后将定位到的位置作为地图中心点，默认：true
                 zoomToAccuracy:true       //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                })
                that.map.addControl(geolocation)
                
                // 获取当前定位的信息
                geolocation.getCurrentPosition((status,result) => {
                  console.log(result.addressComponent)
                })
                // AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
                // AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
              })
            })
          }
      }
    }
</script>
    
<style scoped>
    /*隐藏高德地图logo，版本号*/
    .amap-logo{
    visibility: hidden;
    }
    .amap-copyright {
    visibility: hidden;
    }
    
    .input-card .btn{
        margin-right: 1.2rem;
        width: 9rem;
    }

    .input-card .btn:last-child{
        margin-right: 0;
    }
</style>
    
    