import type { GetStaticPaths, GetStaticProps } from "next"
import { Row, data } from "@/data"
import Category from "@/components/layout/Category"
import { pages } from "@/data/pages"



type Props = {
    page: string
    rows: Row[]
}

export default function Home({ page, rows }: Props) {

    
    return (
        <Category title={ "SFF Compare - "+page } page={ page } rows={ rows }/>
    )
}



// https://stackoverflow.com/a/73884736
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {

    // const page = params?.category as keyof Pages
    // const sheetName = googleSheetsTabs[params.]

    // const pageName = typeof params?.category === "string" ? params.category : null
    const pageName = params?.category as string

    // const rows = pageName ? await readSheet(googleSheetsTabs[pageName], true) : []
    // const rows = pageName ? getPageRows(pageName) : []
    const rows = data.filter(row => row.page === pageName)

    const props: Props = {
        page: pageName,
        rows,
    }

    return {
        props,
        // revalidate: 60 * 60, // 1 hour, in seconds (60s*60m)
    }
}

// https://stackoverflow.com/a/73884736
export const getStaticPaths: GetStaticPaths = async () => {

    return {
        paths: pages.map(category => ({ params: { category }})),
        fallback: false,
    }
}