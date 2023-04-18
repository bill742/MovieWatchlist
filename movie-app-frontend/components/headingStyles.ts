import { mode } from '@chakra-ui/theme-tools';

export const HeadingStyles = {
  baseStyle: (props) => ({
    color: mode('primaryDark', 'primaryLight')(props),
  }),
  sizes: {},
  variants: {
    header: (props) => ({
      color: mode('black', 'white')(props),
      transform: 'uppercase',
    }),
  },
  defaultProps: {},
};
