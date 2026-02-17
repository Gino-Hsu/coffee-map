"use client";

import dynamic from "next/dynamic";
import { coffeeShop } from "@/type/shopsType";

import LocalCafeIcon from "@mui/icons-material/LocalCafe";

const CoffeeMap = dynamic(() => import("./coffeeMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-custom-bgColor/50 backdrop-blur-sm">
      <div className="animate-bounce">
        <LocalCafeIcon
          className="text-custom-fontColor"
          sx={{ fontSize: 60 }}
        />
      </div>
      <span className="animate-pulse text-xl font-bold tracking-widest text-custom-fontColor">
        Loading...
      </span>
    </div>
  ),
});

export default function LazyCoffeeMap({ shops }: { shops: coffeeShop[] }) {
  return <CoffeeMap shops={shops} />;
}
