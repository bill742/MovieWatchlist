import { Search } from "./search";
import { UserMenu } from "./user-menu";

interface HeaderContentProps {
  onSearchSubmit?: () => void;
}

function HeaderContent({ onSearchSubmit }: HeaderContentProps = {}) {
  return (
    <>
      <Search onSubmit={onSearchSubmit} />
      <UserMenu />
    </>
  );
}

HeaderContent.displayName = "HeaderContent";

export { HeaderContent };
