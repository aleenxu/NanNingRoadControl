/**
 * @file 渲染基础地图
 */
const styleUrl = process.env.NODE_ENV === 'development' ?
  '//222.85.218.31:60055/service/solu/style/id/4638' :
  '//10.11.57.105:60050/service/solu/style/id/4638'
const mineMapConf = {
  container: 'mapContainer',
  style: styleUrl,
  center: [106.633542, 26.612438],
  zoom: 14,
  pitch: 0,
  maxZoom: 17,
  minZoom: 3,
}

export default mineMapConf
