import MapComponent from '@/components/mapComponent';

export default async function Map(params: {
  params: Promise<{ lang: string; city: string }>;
}) {
  const { lang, city } = await params.params;

  return (
    <div className="h-[calc(100vh-64px)] p-0">
      <MapComponent lang={lang} city={city} />
    </div>
  );
}
