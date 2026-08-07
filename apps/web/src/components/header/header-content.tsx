import { Search } from "./search";
import { UserMenu } from "./user-menu";

interface HeaderContentProps {
  email?: string | null;
  onSearchSubmit?: () => void;
}

function HeaderContent({ email, onSearchSubmit }: HeaderContentProps = {}) {
  return (
    <>
      <Search onSubmit={onSearchSubmit} />
      <UserMenu email={email ?? null} />
    </>
  );
}

HeaderContent.displayName = "HeaderContent";

export { HeaderContent };
