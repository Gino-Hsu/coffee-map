import CreateShopPage from '@/components/createShopPage';

export default async function CreateShop(params: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params.params;

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <h1 className="text-2xl font-bold pb-4 text-[#5a3d1b]">建立咖啡廳</h1>
      <CreateShopPage lang={lang} />
    </div>
  );
}
