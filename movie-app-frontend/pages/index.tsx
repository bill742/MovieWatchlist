// import { PageComponent } from 'react';
import Layout from '../components/Layout';
import Search from '../components/Search/Search';

export type HomePageProps = {
  upcomingMovies: Object;
};

function HomePage({ upcomingMovies }) {
  // TODO: Other API options beyond movie title. Random?
  // Sorting
  // Add TV option with number of seasons (replace 'movie in API call with 'tv)

  return (
    <Layout>
      <Search />

      {/* <Upcoming upcomingMovies={upcomingMovies} /> */}
    </Layout>
  );
}

HomePage.getInitialProps = async () => {
  const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=fd44fe4d9a4eb34ef554b715a48f207b&language=en-US&page=1`;

  const res = await fetch(url);
  const upcomingMovies = await res.json();

  if (!upcomingMovies) {
    return {
      notFound: true,
    };
  }

  return { upcomingMovies };
};

export default HomePage;
