import { Flex } from '@chakra-ui/react';
import Head from 'next/head';
import { Fragment, ReactNode } from 'react';
import Header from './Header/Header';

type Props = {
  children: ReactNode;
};

export default function Layout(props: Props) {
  return (
    <Fragment>
      <Head>
        <title>React Movie Search</title>
        <meta name="description" content="description goes here" />
        <meta name="keywords" content="keywords go here" />
      </Head>

      <Flex
        maxWidth="79.6875rem"
        width="100%"
        flexDirection="column"
        margin="0 auto"
      >
        <Header />

        {props.children}
      </Flex>
    </Fragment>
  );
}
