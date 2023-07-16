import { css } from "@emotion/react"
import { ReactNode } from "react"
import Head from "next/head"



type Props = {
    title: string
    children?: ReactNode
}

export default function Layout({ children, title }: Props) {

    return <>
        <Head>
            <title>{ title || "SFF Compare" }</title>
            <meta name="description" content="SFF compare" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="container" css={ style }>
            { children }
        </div>
    </>
}

const style = css`

    width: 100%;
    /* overflow-x: auto; */
    display: grid;
    grid-template-columns: 25rem 1fr;
    gap: 1vw;
    width: 100%;
    height: 100%;
`