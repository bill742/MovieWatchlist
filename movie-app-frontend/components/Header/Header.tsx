import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Button, Heading, useColorMode } from '@chakra-ui/react';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <header>
      <Heading as="h1">React Movie Search</Heading>

      <Button onClick={toggleColorMode}>
        {colorMode === 'light' ? (
          <MoonIcon aria-label="Dark Mode" />
        ) : (
          <SunIcon />
        )}
      </Button>
    </header>
  );
};

export default Header;
