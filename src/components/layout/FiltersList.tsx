import { css } from "@emotion/react"
import { useRouter } from "next/router"
import FilterControl from "../FilterControl"
import { useState } from "react"
import Footer from "./Footer"
import { blacklist, hiddenFilters } from "@/utils/googleSheetsUrls"
import Image from "next/image"
import Logo from "@/../public/cube.png"
import { GithubLink } from "../GithubLink"
import Link from "next/link"
import { pages, tabNames } from "@/data"
import { Query } from "@/utils/queryString/query"
import { Options } from "@/utils/Options"
import Button from "../utility/Button"
import Select from "../utility/Select"


// type Option = {
//     value: number,
//     label: string|number,
// }

function getMinMax(values: (string|number)[]) {
    let min = 0
    let max = 0
    
    for(const value of values) {
        if(typeof value === "number") {
            if(value < min) {
                min = value
            }
            if(value > max) {
                max = value
            }
        }
    }
    return { min, max }
}




type Props = {
    // rows: Partial<CoolerLP>[],
    query: Query,
    options: Options,
}

export default function FiltersList({ query, options }: Props) {

    const [showAllOptions, setShowAllOptions] = useState(false)

    const basicOptions  = options.getKeys().filter(option => !hiddenFilters.has(option)).sort()
    const hiddenOptions = options.getKeys().filter(option => hiddenFilters.has(option)).sort()

    return (
        <div css={ style }>

            {
                process.env.NODE_ENV === "development" &&
                <div style={{ display: "flex" }}>
                    <button inline onClick={ () => console.info(options) }>Log options</button>
                    <button inline onClick={ () => console.info(query) }>Log query</button>
                </div>
            }

            {
                [...basicOptions, ...(showAllOptions ? hiddenOptions : []) ]
                    .filter(optionLabel => !blacklist.has(optionLabel))
                    .map(optionLabel => {
                        return (
                            <FilterControl
                                label={optionLabel}
                                values={ options.getValues(optionLabel) }
                                options={ options }
                                query={ query }
                                // headerIndex={ headerIndex }
                                // filters={query.fil}
                                // ranges={query.r}
                                key={optionLabel}
                            />
                        )
                    })
            }
            {/* <pre>{ JSON.stringify(possibleValues,null,4) }</pre> */}

            {
                hiddenOptions.length > 0 &&
                <Button onClick={() => setShowAllOptions(!showAllOptions)}>
                    {/* { showAllOptions ? <ChevronRight size={ 18 }/> : <ChevronDown size={ 18 }/> } */}
                    { showAllOptions ? "Show fewer options" : "Show more options" }
                </Button>
            }
        </div>
    )
}

const style = css`
    padding: 0 1em;
    margin: 1em 0;
`