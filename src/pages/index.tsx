import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/header/Header";
import Main from "../components/main/Main";
import { signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>GiftMe</title>
        <meta
          name="description"
          content="Coordinate gift giving with friends and family."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.giftme.cool/" />
        <meta property="og:title" content="GiftMe" />
        <meta
          property="og:description"
          content="Coordinate gift giving with friends and family."
        />
        <meta property="og:image" content="" />
        <meta property="og:video" content="/og-video.mov" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-[#9fbfdf] pb-6">
        <Header />
        <div className="flex flex-col">{sessionData ? <Main /> : <Auth />}</div>
      </main>
    </>
  );
};

export default Home;

const Auth: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="mt-20 rounded-full bg-black px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={() => signIn("google")}
      >
        {sessionData ? "Sign out" : "Sign in with Google"}
      </button>
    </div>
  );
};
