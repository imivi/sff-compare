import s from "./index.module.scss"

import Head from "next/head";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import { Header } from "@/components/Header";


const inter = Inter({ subsets: ["latin"] });


export default function Home() {

  return (
    <>
      <Head>
        <title>SFF Compare</title>
        <meta name="description" content="SFF Compare" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={[s.container, inter.className].join(" ")}>
        <Header />
        <div className={s.horizontal_layout}>
          <Sidebar />
          <Table />
        </div>
      </div>
    </>
  );
}
