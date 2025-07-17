import L from 'leaflet';

const coffeeIcon = new L.Icon({
  iconUrl: '/leaflet/maker-coffee.png', // 自己的圖
  iconSize: [42, 42], // [寬, 高]
  iconAnchor: [21, 42], // 圖片哪個點對齊地圖座標（通常底部中心）
  popupAnchor: [0, -40], // popup 出現的位置（相對於 marker）
  shadowUrl: '/leaflet/marker-shadow.png', // 可選：自定陰影
  shadowSize: [50, 50],
  shadowAnchor: [12, 50],
});

const favoriteIcon = new L.Icon({
  iconUrl: '/leaflet/maker-favorite.png',
  iconSize: [33, 33],
  iconAnchor: [16, 42],
  popupAnchor: [0, -40],
  shadowUrl: '/leaflet/marker-shadow.png',
  shadowSize: [50, 50],
  shadowAnchor: [15, 60],
});

export { coffeeIcon, favoriteIcon };
