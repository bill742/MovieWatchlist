import { ModeToggle } from "./mode-toggle";
import { Search } from "./search";

interface HeaderContentProps {
  onSearchSubmit?: () => void;
}

export function HeaderContent({ onSearchSubmit }: HeaderContentProps = {}) {
  return (
    <>
      <Search onSubmit={onSearchSubmit} />
      <ModeToggle />
    </>
  );
}
