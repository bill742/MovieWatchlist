import { ContentTabs } from "@/components/home/content-tabs";
import { RegionSelect } from "@/components/header/region-select";

export default function Home() {
  return (
    <div className="space-y-12 py-8">
      <div className="flex flex-row items-center gap-4">
        Select your region: <RegionSelect />
      </div>
      <ContentTabs />
    </div>
  );
}
