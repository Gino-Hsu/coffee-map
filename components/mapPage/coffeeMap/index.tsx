"use client";

import { useContext, useEffect, useRef } from "react";
import { UserContext } from "@/lib/context/userContext";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { coffeeIcon, favoriteIcon } from "@/lib/map/mapIcon";
import PopupContent from "./popupContent";
import { useSearchParams } from "next/navigation";

export interface coffeeShop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
}

export default function CoffeeMap({ shops }: { shops: coffeeShop[] }) {
  const { user } = useContext(UserContext);
  const favoriteList = user?.favoriteList ? user?.favoriteList : [];
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shop_id");

  return (
    <MapContainer
      center={[25.034, 121.5645]}
      zoom={14}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {shops.map((shop) => {
        const isFavorite = favoriteList.includes(shop.id);
        const isSelected = shopId === shop.id;

        return (
          <CoffeeMarker
            key={shop.id}
            shop={shop}
            isFavorite={isFavorite}
            isSelected={isSelected}
          />
        );
      })}
    </MapContainer>
  );
}

function CoffeeMarker({
  shop,
  isFavorite,
  isSelected,
}: {
  shop: coffeeShop;
  isFavorite: boolean;
  isSelected: boolean;
}) {
  const map = useMap();
  const markerRef = useRef<LeafletMarker>(null);

  useEffect(() => {
    if (isSelected && markerRef.current) {
      map.setView([shop.lat, shop.lng], 18);
      setTimeout(() => {
        markerRef.current?.openPopup();
      }, 300);
    }
  }, [isSelected, shop, map]);

  return (
    <Marker
      ref={markerRef}
      position={[shop.lat, shop.lng]}
      icon={isFavorite ? favoriteIcon : coffeeIcon}
    >
      <Popup>
        <PopupContent shop={shop} isFavorite={isFavorite} />
      </Popup>
    </Marker>
  );
}
