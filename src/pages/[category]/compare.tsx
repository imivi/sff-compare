import type { GetStaticPaths, GetStaticProps } from "next"
import { CoolerLP } from "@/types"
import Layout from "@/components/layout/Layout"
import { Row, data } from "@/data"
import { pages } from "@/data"
import Sidebar from "@/components/layout/Sidebar"
import FiltersList from "@/components/layout/FiltersList"



type Props = {
    title: string
    rows: Row[]
}

export default function Home({ title, rows }: Props) {

    
    return (
        <Layout title={ "SFF Compare - comparison" }>
            <Sidebar>
                <p>Sidebar content</p>
            </Sidebar>
            <pre>{ JSON.stringify(rows,null,4) }</pre>
        </Layout>
    )
}



// https://stackoverflow.com/a/73884736
export const getStaticProps: GetStaticProps = async ({ params }) => {

    const pageName = typeof params?.category === "string" ? params.category : null
    const rows = data.filter(row => row.page === pageName)

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

    // const categories = Object.keys(googleSheetsTabs)


    return {
        paths: pages.map(category => ({ params: { category }})),
        fallback: false,
    }
}