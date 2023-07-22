import { css } from "@emotion/react"
import FilterControl from "../FilterControl"
import { useState } from "react"
import { blacklist, hiddenFilters } from "@/utils/googleSheetsUrls"
import { Query } from "@/utils/queryString/query"
import { Options } from "@/utils/Options"
import Button from "../utility/Button"



/*
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
*/



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
                    <button onClick={ () => console.info(options) }>Log options</button>
                    <button onClick={ () => console.info(query) }>Log query</button>
                    <button onClick={ () => console.info(options) }>Log options</button>
                    <button onClick={ () => console.info(query.r) }>Log ranges</button>
                </div>
            }

            {
                [...basicOptions, ...(showAllOptions ? hiddenOptions : []) ]
                    .filter(optionLabel => !blacklist.has(optionLabel))
                    .map((optionLabel,i) => {
                        return (
                            <FilterControl
                                label={optionLabel}
                                values={ options.getValues(optionLabel) }
                                options={ options }
                                query={ query }
                                // headerIndex={ headerIndex }
                                // filters={query.fil}
                                // ranges={query.r}
                                key={ `${ i }-${ optionLabel }` }
                                // key_={ `${ i }-${ optionLabel }` }
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