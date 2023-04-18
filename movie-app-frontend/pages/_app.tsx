import { ChakraProvider } from '@chakra-ui/react';
import '../styles/globals.css';
import { movieAppTheme } from '../styles/theme';

function MovieApp({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={movieAppTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MovieApp;
