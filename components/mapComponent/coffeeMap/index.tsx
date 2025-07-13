'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface coffeeShop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
}

const coffeeIcon = new L.Icon({
  iconUrl: '/leaflet/maker-coffee.png', // 你自己的圖
  iconSize: [42, 42], // [寬, 高]
  iconAnchor: [16, 42], // 圖片哪個點對齊地圖座標（通常底部中心）
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

export default function CoffeeMap({
  shops,
  favorites,
}: {
  shops: coffeeShop[];
  favorites: string[];
}) {
  return (
    <MapContainer
      center={[25.034, 121.5645]}
      zoom={14}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shops.map(shop => {
        if (favorites.includes(shop.id)) {
          return (
            <Marker
              key={shop.id}
              position={[shop.lat, shop.lng]}
              icon={favoriteIcon}
            >
              <Popup>{shop.name}</Popup>
            </Marker>
          );
        } else {
          return (
            <Marker
              key={shop.id}
              position={[shop.lat, shop.lng]}
              icon={coffeeIcon}
            >
              <Popup>
                <strong>{shop.name}</strong>
                <br />
                {shop.address}, {shop.city}
              </Popup>
            </Marker>
          );
        }
      })}
    </MapContainer>
  );
}
