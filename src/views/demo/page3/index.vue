<template>
  <l-map style="height: 300px" :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <!-- <l-marker :lat-lng="markerLatLng" :icon="icon2"></l-marker> -->
    <!-- <div v-for="n in ll" :key="n">
      <l-marker :lat-lng="n.p" :icon="icon2">
        <l-popup>ss</l-popup>
      </l-marker>
    </div> -->
<!-- <l-marker :lat-lng="markerLatLng">
<l-popup>Hello!</l-popup>
</l-marker>  -->
    <l-marker :lat-lng="[51.504, -0.159]" >
        <l-popup>Hello</l-popup>
      </l-marker>
  </l-map>
</template>

<script>
import L from "leaflet";
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
  data() {
    return {
      ll: [{ p: [51.504, 0] }, { p: [51.504, 0.11] }],
      name: "page3",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a target="_blank" >INSIS spring</a> contributors',
      zoom: 15,
      center: [51.504, -0.159],
      markerLatLng: [51.504, -0.159],
      icon2: L.icon({
        iconUrl: icon, //'@/../public/image/baidu-pan-logo.png',
      }),
    };
  },
};
</script>
<style lang="scss">
@import "~leaflet/dist/leaflet.css";
</style>