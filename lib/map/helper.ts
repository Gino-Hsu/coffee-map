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

  // Nominatim 使用政策：需帶可識別的 User-Agent，且建議每秒最多 1 次請求。
  // 這裡加上逾時保護，避免外部服務無回應時 hang 住整個 request。
  let res: Response;
  try {
    res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodedAddress}`,
      {
        headers: {
          'User-Agent': 'coffee-map/1.0 (yumin.f2e@gmail.com)',
        },
        signal: AbortSignal.timeout(8000),
      }
    );
  } catch (err) {
    console.error('❗️Geocoding request failed:', err);
    throw new Error('GEOCODING_REQUEST_FAILED');
  }

  if (!res.ok) {
    console.error(`❗️Geocoding responded with HTTP ${res.status}`);
    throw new Error('GEOCODING_REQUEST_FAILED');
  }

  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('ADDRESS_NOT_FOUND');
  }

  const lat = parseFloat(data[0].lat);
  const lng = parseFloat(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new Error('ADDRESS_NOT_FOUND');
  }

  return { lat, lng };
};
