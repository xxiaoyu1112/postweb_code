export default function MapLoader () {
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve(window.AMap)
      } else {
        // 动态创造DOM，引入api
        let script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initAMap&key=1c9f2d7558480c8c020f14c6de8dc120'
        script.onerror = reject
        document.body.appendChild(script)
      }
      window.initAMap = () => {
        resolve(window.AMap)
      }
    })
}