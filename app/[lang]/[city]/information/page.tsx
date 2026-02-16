import InformationPage from "@/components/informationPage";
import { enumCity } from "@/type/shopsType";

export default async function Information({
  params,
}: {
  params: Promise<{ city: enumCity }>;
}) {
  const { city } = await params;
  return <InformationPage city={city} />;
}
