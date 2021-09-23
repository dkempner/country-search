import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <h1>Hello World</h1>
      <Link href="/countries">Country List</Link>
    </>
  );
};

export default Home;
