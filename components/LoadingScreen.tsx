import { LogoRuangobat } from "@/public/img/LogoRuangobat";

export default function LoadingScreen() {
  return (
    <>
      <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-white">
        <div className="flex items-center justify-center">
          <LogoRuangobat className="size-10 text-gray/20" />
          <div className="absolute size-20 animate-spin rounded-full border-4 border-purple border-t-gray-300"></div>
        </div>
      </div>
    </>
  );
}
