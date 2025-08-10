import MapPage from '@/components/mapPage';

export default async function Map(params: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params.params;

  return (
    <div className="h-[calc(100vh-64px)] p-0">
      <MapPage city={city} />
    </div>
  );
}
