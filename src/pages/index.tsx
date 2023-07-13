import type { GetStaticProps } from "next"
import Head from 'next/head'
import { Row, readSheet } from '@/utils/read-public-sheet'
import { CoolerLP, Sheet } from "@/types"
import Table from "@/components/Table"
import { css } from "@emotion/react"
import { Box } from "tabler-icons-react"
import Footer from "@/components/Footer"
import Layout from "@/components/Layout"




type Props = {
    rows: CoolerLP[]
}

export default function Home({ rows }: Props) {

    return (
        <Layout title="SFF Compare" rows={ rows }/>
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