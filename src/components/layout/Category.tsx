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
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { Box, Eye } from "tabler-icons-react"
// import Visualizer from "../Visualizer"

// Lazy load the react three fiber threejs 3D viewer
const Visualizer = dynamic(() => import("../Visualizer"))





type Props = {
    title: string
    page: string | null
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

    const enableVisualizer = page && validPages.has(page)

    return <>
        <div css={ style }>
            <Layout title={ title }>

                <Sidebar>

                    <fieldset>

                        {/* <h2>Page: { page }</h2> */}

                        <label>
                            {/* <span>Category</span> */}
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

                        <label data-disabled={ selectedRows.length===0 }>
                            <Checkbox
                                checked={ selectedRows.length===0 ? false : hideUnselected }
                                disabled={ selectedRows.length===0 }
                                onChange={ () => setHideUnselected(!hideUnselected) }
                                // disabled={ query.compareCount()===0 }
                            />
                            <span>Hide unselected rows</span>
                            <Eye size={ 18 }/>
                        </label>

                        {
                            enableVisualizer &&
                            <label data-disabled={ !enableVisualizer }>
                                <Checkbox
                                    checked={ showVisualizer }
                                    disabled={ !enableVisualizer }
                                    onChange={ () => setShowVisualizer(!showVisualizer) }
                                />
                                <span>
                                    Show 3D visualizer <Box size={18}/>
                                </span>
                            </label>
                        }
                    </fieldset>

                    <FiltersList query={ query } options={ options }/>
                </Sidebar>

                <main>
                    <PanelGroup autoSaveId="panel-table-viewer" direction="vertical" className="panel-table-viewer">

                        <Panel style={{ overflow: "auto" }} id="table" order={ 0 }>
                            <ErrorBoundary fallback={ <p>Error loading table</p> }>
                                <Table rows={ (hideUnselected && selectedRows.length>0) ? selectedRows : rows } query={ query } applyFilters={ true }/>
                            </ErrorBoundary>
                        </Panel>

                        {
                            showVisualizer &&
                            <>
                                <PanelResizeHandle className="resize-handle"/>
        
                                <Panel id="visualizer" order={ 1 }>
                                    <div className="visualizer" data-show={ showVisualizer }>
                                        <ErrorBoundary fallback={ <p>Error loading visualizer</p> }>
                                            { showVisualizer && <Visualizer rows={ selectedRows }/> }
                                        </ErrorBoundary>
                                    </div>
                                </Panel>
                            </>
                        }

                    </PanelGroup>


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

    .resize-handle {
        background-color: #3190fd;
        width: 100%;
        height: 3px;
    }
    
    main {
        height: 100%;
        position: relative;
        overflow: auto;

        .panel-table-viewer {
            overflow: auto;
        }

        /* display: grid; */
        /* grid-template-rows: 1fr auto; */

        &[data-split=true] {
            /* display: grid; */
            /* grid-template-rows: 1fr 1fr; */
            /* gap: 0.5vw; */
        }

        .visualizer {
            /* height: 0; */
            height: 100%;

            /* &[data-show=true] {
                height: 50vh;
            } */
        }
    }

    fieldset {
        border: none;
        /* display: flex; */
        /* flex-direction: column; */
        /* place-items: center; */
        margin: 0 auto;

        label {
            /* display: grid; */
            /* grid-template-columns: 1fr 1fr; */
            display: flex;
            place-items: center;
            gap: .5em;
            padding: 1vh 0;
            border-bottom: 1px solid #ddd;
            color: #1c6bc5;
            cursor: pointer;

            &[data-disabled=true] {
                cursor: default;
                color: black;
                opacity: 0.4;
            }
        }
    }
`
