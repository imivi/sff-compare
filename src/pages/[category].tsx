import type { GetStaticPaths, GetStaticProps } from "next"
import Head from 'next/head'
import { Row, readSheet } from '@/utils/read-public-sheet'
import { CoolerLP, Sheet } from "@/types"
import Table from "@/components/Table"
import { css } from "@emotion/react"
import { Box } from "tabler-icons-react"



type Props = {
    title: string,
}

export default function Home({ title }: Props) {

    
    return (
        <main>
            <h1>{ title }</h1>
        </main>
    )
}



// https://stackoverflow.com/a/73884736
export const getStaticProps: GetStaticProps = async ({ params }) => {

    // const rows = await readSheet<CoolerLP>("CPU Cooler <70mm")

    return {
        props: {
            title: params?.category || "undefined title",
            // examples: await readSheet("example"),
        },
        // revalidate: 60 * 60, // 1 hour, in seconds (60s*60m)
    }
}

// https://stackoverflow.com/a/73884736
export const getStaticPaths: GetStaticPaths = async () => {

    // const rows = await readSheet<CoolerLP>("CPU Cooler <70mm")

    const titles = ["apple","banana","coconut"]

    return {
        paths: titles.map(title => ({ params: { category: title }})),
        fallback: false,
    }
}