enum enumCity {
  TAIPEI = "taipei",
  NEW_TAIPEI = "new-taipei",
  TAOYUAN = "taoyuan",
  TAICHUNG = "taichung",
  TAINAN = "tainan",
  KAOHSIUNG = "kaohsiung",
}

interface coffeeShop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  createdAt: Date;
  createdBy: string | null;
  phone: string | null;
  openingHours: string | null;
}

export { enumCity, type coffeeShop };
