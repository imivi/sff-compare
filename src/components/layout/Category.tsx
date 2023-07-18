import { css } from "@emotion/react"
import { Row } from "@/data"
import Layout from "./Layout"
import Table from "./Table"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import Sidebar from "./Sidebar"
import { Query } from "@/utils/queryString/query"
import { Options } from "@/utils/Options"
import FiltersList from "./FiltersList"
import Select from "../utility/Select"
import Checkbox from "../utility/Checkbox"
import { tabNames } from "@/data/pages"
import dynamic from "next/dynamic"
import { validPages } from "../Visualizer"
import { ErrorBoundary } from "react-error-boundary"

// Lazy load the react three fiber threejs 3D viewer
const Visualizer = dynamic(() => import("../Visualizer"))





function omit(obj: Record<string, any>, key: string) {
    delete obj[key]
    return obj
}


type Props = {
    title: string
    page: string
    rows: Row[]
}


export default function Category({ title, page, rows }: Props) {

    const [hideUnselected, setHideUnselected] = useState(false)
    const [showVisualizer, setShowVisualizer] = useState(false)
    
    // Get filters and sorting from query string
    const router = useRouter()

    // const options = getOptions(rows)
    const options = useMemo(() => new Options(rows), [rows])

    if(rows.length === 0) {
        return <p>Error: table received zero rows</p>
    }
    


    // const query = parseQueryString(router.query, options)

    const query = new Query(router.query, options)

    // console.log(query)

    // console.log({ hideUnselected })

    const selectedRows = rows.filter(row => query.hasRowId(row.id))

    // const path = router.asPath.slice(1) // Remove leading slash
    // const pathWithoutQuery = (path.includes("?") ? path.split("?")[0] : path).replaceAll("/","")

    // console.log({ path, pathWithoutQuery })

    function handleCategoryChange(page: string) {
        router.push(page)

        // if(pathWithoutQuery.includes("compare")) {
        //     router.push({
        //         pathname: page+"/compare",
        //         query: omit(router.query, "category"),
        //     })
        // }
        // else {
        //     router.push({
        //         pathname: page,
        //         query: omit(router.query, "category"),
        //     })
        // }
    }

    return <>
        <div css={ style }>
            <Layout title={ title }>

                <Sidebar>

                    <fieldset>

                        <label>
                            <span>Category</span>
                            <Select onChange={ (e) => handleCategoryChange(e.target.value) }>
                                {
                                    Object.entries(tabNames).map(([page,tabName]) => (
                                        <option value={ "/"+page } key={ page }>
                                            { tabName }
                                        </option>
                                    ))
                                }
                            </Select>
                        </label>

                        <label>
                            <span>Hide unselected rows</span>
                            <Checkbox
                                checked={ hideUnselected }
                                onChange={ () => setHideUnselected(!hideUnselected) }
                                // disabled={ query.compareCount()===0 }
                            />
                        </label>

                        {
                            validPages.has(page) &&
                            <label>
                                <span>Show 3D visualizer</span>
                                <Checkbox
                                    checked={ showVisualizer }
                                    // disabled={ query.compareCount()===0 }
                                    onChange={ () => setShowVisualizer(!showVisualizer) }
                                />
                            </label>
                        }
                    </fieldset>

                    <FiltersList query={ query } options={ options }/>
                </Sidebar>

                <main>
                    <Table rows={ (hideUnselected && selectedRows.length>0) ? selectedRows : rows } query={ query } applyFilters={ true }/>

                    <div className="visualizer" data-show={ showVisualizer }>
                        <ErrorBoundary fallback={ <p>Error loading visualizer</p> }>
                            { showVisualizer && <Visualizer rows={ selectedRows }/> }
                        </ErrorBoundary>
                    </div>
                </main>

            </Layout>
        </div>
    </>
}

const style = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    display: block;
    /* grid-template-rows: calc(100vh - 3rem) 1fr; */

    main {
        height: 100%;
        position: relative;
        overflow: auto;

        display: grid;
        grid-template-rows: 1fr auto;

        &[data-split=true] {
            /* display: grid; */
            /* grid-template-rows: 1fr 1fr; */
            /* gap: 0.5vw; */
        }

        .visualizer {
            height: 0;

            &[data-show=true] {
                height: 50vh;
            }
        }
    }

    fieldset {
        border: none;

        label {
            display: grid;
            grid-template-columns: 1fr 1fr;
            place-items: center;
            padding: 1vh 0;
            border-bottom: 1px solid #ddd;
        }
    }
`
