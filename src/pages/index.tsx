import type { GetStaticProps } from "next"
import Head from 'next/head'
import { Row, readSheet } from '@/utils/read-public-sheet'
import { CoolerLP, Sheet } from "@/types"
import Table from "@/components/Table"
import { css } from "@emotion/react"
import { Box } from "tabler-icons-react"


const googleSheetsLink = "https://docs.google.com/spreadsheets/d/1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4/edit#gid=0"


type Props = {
    rows: CoolerLP[],
}

export default function Home({ rows }: Props) {

    // console.log({ rows })

    return (
        <>
            <Head>
                <title>
                    <Box size={ 32 }/>SFF Compare
                </title>
                <meta name="description" content="SFF compare" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main css={ style }>
                {/* <h1>Home</h1> */}
                <header>
                    <span>All data is from</span>
                    <a href={ googleSheetsLink } rel="noreferrer" target="_blank">SFF PC Master List</a>
                    {/* <span>by u/prayogahs with contribution from u/ermac-318</span> */}
                </header>
                {/* <a href="https://docs.google.com/spreadsheets/d/10WDbAPAY7Xl5DT36VuMheTPTTpqx9x0C5sDCnh4BGps/edit#gid=1839148703">Google sheets link</a> */}
                <Table rows={ rows }/>
            </main>
        </>
    )
}


const style = css`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;

    header {
        min-height: 2rem;
        background-color: #f4f4f4;
        color: #777;
        display: flex;
        place-content: center;
        place-items: center;
        border-bottom: 1px solid #ddd;
        gap: .2em;
        padding: 1vh 1vw;
        font-size: .9em;

        a {
            color: dodgerblue;
            text-decoration: none;
        }
    }
`


// https://stackoverflow.com/a/73884736
export const getStaticProps: GetStaticProps<Props> = async () => {

    const rows = await readSheet<CoolerLP>("CPU Cooler <70mm")

    return {
        props: {
            rows,
            // examples: await readSheet("example"),
        },
        revalidate: 60 * 60, // 1 hour, in seconds (60s*60m)
    }
}