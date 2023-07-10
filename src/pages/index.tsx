import type { GetStaticProps } from "next"
import Head from 'next/head'
import { Row, readSheet } from '@/utils/read-public-sheet'
import { CoolerLP, Sheet } from "@/types"
import Table from "@/components/Table"


type Props = {
    rows: CoolerLP[],
}

export default function Home({ rows }: Props) {

    // console.log({ rows })

    return (
        <>
            <Head>
                <title>SFF Compare</title>
                <meta name="description" content="SFF compare" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>Home</h1>
                <a href="https://docs.google.com/spreadsheets/d/10WDbAPAY7Xl5DT36VuMheTPTTpqx9x0C5sDCnh4BGps/edit#gid=1839148703">Google sheets link</a>
                <Table rows={ rows }/>
            </main>
        </>
    )
}


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