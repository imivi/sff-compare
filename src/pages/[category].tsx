import type { GetStaticPaths, GetStaticProps } from "next"
import { readSheet } from '@/utils/read-public-sheet'
import { CoolerLP } from "@/types"
import Layout from "@/components/Layout"
import { Pages, googleSheetsTabs } from "@/utils/googleSheetsUrls"



type Props = {
    title: string
    rows: CoolerLP[]
}

export default function Home({ title, rows }: Props) {

    
    return (
        <Layout title={ "SFF Compare - "+title } rows={ rows }/>
    )
}



// https://stackoverflow.com/a/73884736
export const getStaticProps: GetStaticProps = async ({ params }) => {

    // const page = params?.category as keyof Pages
    // const sheetName = googleSheetsTabs[params.]

    const pageName = typeof params?.category === "string" ? params.category : null
    
    const rows = pageName ? await readSheet(googleSheetsTabs[pageName], true) : []

    return {
        props: {
            title: pageName,
            rows,
            // examples: await readSheet("example"),
        },
        // revalidate: 60 * 60, // 1 hour, in seconds (60s*60m)
    }
}

// https://stackoverflow.com/a/73884736
export const getStaticPaths: GetStaticPaths = async () => {

    // const rows = await readSheet<CoolerLP>("CPU Cooler <70mm")

    const categories = Object.keys(googleSheetsTabs)

    return {
        paths: categories.map(category => ({ params: { category }})),
        fallback: false,
    }
}