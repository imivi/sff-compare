import { Row } from "@/data"
import { pages } from "@/data/pages"
import type { GetStaticProps } from "next"
import Link from "next/link"




type Props = {
    // rows: Row[]
}

export default function Home() {

    return (
        <ul>
        {
            pages.map(page => (
                <li key={ page }>
                    <Link href={ "/"+page }>Go to { page }</Link>
                </li>
            ))
        }
        </ul>
    )
}



// https://stackoverflow.com/a/73884736
export const getStaticProps: GetStaticProps = async () => {

    // const rows = await readSheet("CPU Cooler <70mm")

    return {
        props: {
            // rows,
            // examples: await readSheet("example"),
        },
        revalidate: 60 * 60, // 1 hour, in seconds (60s*60m)
    }
}