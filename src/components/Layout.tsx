import { css } from "@emotion/react"
import Head from "next/head"
import Table from "./Table"
import { Row } from "@/data"



type Props = {
    title?: string
    rows: Row[]
    // children?: ReactNode
}

export default function Layout({ title, rows }: Props) {

    return <>
        <Head>
            <title>{ title || "SFF Compare" }</title>
            <meta name="description" content="SFF compare" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <div css={ style }>
            <Table rows={ rows }/>
            {/* <Footer/> */}
        </div>
    </>
}

const style = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: grid;
    /* grid-template-rows: calc(100vh - 3rem) 1fr; */
    display: block;
    height: 100%;
`
