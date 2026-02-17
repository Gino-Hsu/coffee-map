enum enumCity {
  TAIPEI = "taipei",
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
}

export { enumCity, type coffeeShop };
