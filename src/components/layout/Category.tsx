import { css } from "@emotion/react"
import { Row } from "@/data"
import Layout from "./Layout"
import Table2 from "./Table2"
import { useRouter } from "next/router"
import { useMemo } from "react"
import Sidebar from "./Sidebar"
import { blacklist } from "@/utils/googleSheetsUrls"
import { Query } from "@/utils/queryString/query"
import { Options } from "@/utils/Options"
import FiltersList from "./FiltersList"







type Props = {
    title: string
    rows: Row[]
}


export default function Category({ title, rows }: Props) {

    // Get filters and sorting from query string
    const router = useRouter()

    // const options = getOptions(rows)
    const options = useMemo(() => new Options(rows), [rows])

    if(rows.length < 1) {
        console.info("Rows:", rows)
        return <p>Error: table received zero rows</p>
    }
    
    const header = Object.keys(rows[0]).filter(key => !blacklist.has(key))


    // const query = parseQueryString(router.query, options)

    const query = new Query(router.query, options)

    // console.log(query)



    return <>
        <div css={ style }>
            <Layout title={ title }>
                <Sidebar>
                    <FiltersList query={ query } options={ options }/>
                </Sidebar>
                <Table2 rows={ rows } header={ header } query={ query }/>
            </Layout>
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
