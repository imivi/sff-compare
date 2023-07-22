import MultiSelect, { SelectOption } from "@/components/utility/MultiSelect"
import { pages } from "@/data/pages"
import { css } from "@emotion/react"
import type { GetStaticProps } from "next"
import Link from "next/link"
import { useState } from "react"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"




type Props = {
    // rows: Row[]
}

export default function Home() {

    return (
        <main>
            <ul>
            {
                pages.map(page => (
                    <li key={ page }>
                        <Link href={ "/"+page }>Go to { page }</Link>
                    </li>
                ))
            }
            </ul>

            <TestMultiSelect/>


            {/* <div style={{ height: 700 }}>
                <Visualizer rows={ [] }/>
            </div> */}

        </main>
    )
}


function TestMultiSelect() {

    const [selected, setSelected] = useState<SelectOption[]>([])

    const options = [
        {
            label: "apple",
            value: 1,
        },
        {
            label: "banana",
            value: 2,
        },
        {
            label: "coconut",
            value: 3,
        },
    ]
    
    return (<>
        <MultiSelect
            className="multiselect"
            closeMenuOnSelect={ true }
            options={ options }
            values={ selected }
            onChange={ (values) => setSelected(values) }
        />
        <p>lorems</p>
        <p>lorems</p>
        <p>lorems</p>
        <p>lorems</p>
        <p>lorems</p>
        <p>lorems</p>
        <p>lorems</p>
        <p>lorems</p>
    </>)
}


/*
function PanelTest() {
    return (
        <div className="panel-test" css={ style }>
        <h2>panels</h2>
        <PanelGroup autoSaveId="panel-test" direction="vertical" className="panel-test">

            <Panel defaultSize={ 25 }>
                <p>top</p>
                <p>top</p>
                <p>top</p>
                <p>top</p>
                <p>top</p>
            </Panel>

            <PanelResizeHandle className="resize-handle"/>

            <Panel>
                <p>bottom</p>
                <p>bottom</p>
                <p>bottom</p>
                <p>bottom</p>
                <p>bottom</p>
            </Panel>

        </PanelGroup>
    </div>
    
    )
}

const style = css`
    border: 1px solid brown;
    display: grid;
    grid-template-rows: auto 1fr;
    height: 500px;

    .panel-test {
        border: 1px solid darkblue;        
    }

    .resize-handle {
        background-color: black;
        width: 100%;
        height: 3px;
    }
`
*/


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