function getTransformAddress(address: string): string {
  const regex =
    /^(?:(\d{3}))?(台北市|新北市|桃園市|臺北市|台中市|台南市|高雄市)(.+區)(.+路|.+街|.+大道)(\d+)-?(\d+)?號$/;

  const match = address.match(regex);

  if (!match) return address; // 無法解析就原樣返回

  const [_, zip, city, district, street, number1, number2] = match; // eslint-disable-line @typescript-eslint/no-unused-vars

  const fullNumber = number2 ? `${number1}之${number2}` : `${number1}`;

  // 將台北市標準化為「臺北市」
  const normalizedCity = city.replace(/^台/, '臺');

  return `${fullNumber}號, ${street}, ${district}, ${normalizedCity}, ${zip}`;
}

export const getCoordsFromAddress = async (address: string) => {
  const transformAddress = getTransformAddress(address);
  const encodedAddress = encodeURIComponent(transformAddress);

  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`,
    {
      headers: {
        'User-Agent': 'coffee-map/1.0 (yumin.f2e@gmail.com)',
      },
    }
  );

  const data = await res.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } else {
    throw new Error('找不到該地址');
  }
};
