export const getCoordsFromAddress = async (address: string) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${
      (encodeURIComponent(address),
      {
        headers: {
          'User-Agent': 'coffee-map/1.0 (yumin.f2e@gmail.com)', // 建議填寫
        },
      })
    }`
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
