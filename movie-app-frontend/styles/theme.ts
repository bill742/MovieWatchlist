import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { HeadingStyles as Heading } from '../components/headingStyles';

export const movieAppTheme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: mode('white', 'black')(props),
      },
      layout: {
        display: 'grid',
        gridGap: '1rem',
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    })
  },
  colors: {
    white: '#ffffff',
    black: '#333333',
    trueBlack: '#000000',
  },
  components: {
    Heading,
  },
})
