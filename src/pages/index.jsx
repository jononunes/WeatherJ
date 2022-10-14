import Head from "next/head";
import Home from "./home";

const Index = () => {
  return (
    <div>
      <Head>
        <title>WeatherJ</title>
        <meta name="description" content="WeatherJ App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Home />
      </main>
    </div>
  );
};

export default Index;
