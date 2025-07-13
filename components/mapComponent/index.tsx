import CoffeeMap from './coffeeMap';
interface coffeeShop {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
}

export default function MapComponent() {
  const dummyShops: coffeeShop[] = [
    {
      id: '1',
      name: 'Coffee Shop 1',
      lat: 25.034,
      lng: 121.5645,
      address: '123 Coffee St, Taipei',
      city: 'Taipei',
    },
    {
      id: '2',
      name: 'Coffee Shop 2',
      lat: 25.035,
      lng: 121.5655,
      address: '456 Coffee Ave, Taipei',
      city: 'Taipei',
    },
  ];

  const dummyFavoriteLists = ['1'];

  return <CoffeeMap shops={dummyShops} favorites={dummyFavoriteLists} />;
}
