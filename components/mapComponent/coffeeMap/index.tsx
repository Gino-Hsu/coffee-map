'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { coffeeIcon, favoriteIcon } from '@/lib/map/mapIcon';
import PopupContent from './popupContent';

export interface coffeeShop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
}

export default function CoffeeMap({
  shops,
  favorites,
}: // lang,
{
  shops: coffeeShop[];
  favorites: string[];
  lang: string;
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
        const isFavorite = favorites.includes(shop.id);

        return (
          <Marker
            key={shop.id}
            position={[shop.lat, shop.lng]}
            icon={isFavorite ? favoriteIcon : coffeeIcon}
          >
            <Popup>
              <PopupContent shop={shop} isFavorite={isFavorite} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
