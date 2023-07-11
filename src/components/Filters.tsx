import { CoolerLP } from "@/types"
import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Select, { type MultiValue } from "react-select"
import { serializeFilters } from "@/utils/filters/serializeFilters"
import { parseQueryString } from "@/utils/parseQueryString"
import Filter from "./Filter"


type Option = {
    value: number,
    label: string|number,
}

function sortAlphanumeric(a: string|number, b: string|number): number {
    return (a.toString()).localeCompare(b.toString())
}


function isNumberColumn(values: (string|number)[]) {
    return values.some(value => typeof value === "number")
}

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


function getPossibleValues<RowType>(rows: Record<string,string|number>[]) {

    const possibleValues: Record<string,Set<string|number>> = {}

    rows.forEach(row => {
        for(const [key,value] of Object.entries(row)) {
            // Ignore "null" values
            // if(value === "-" || value === "" || value === "?") {
            //     return
            // }
            if(!(key in possibleValues)) {
                possibleValues[key] = new Set<string|number>()
            }
            // console.log("add",key,value)
            possibleValues[key].add(value)
        }
    })

    // const possibleValuesArrays: [string,(string|number)[]][] = []
    const possibleValuesArrays: Record<string, (string|number)[]> = {}

    for(const [key,set] of Object.entries(possibleValues)) {
        // possibleValuesArrays.push([key, Array.from(set)])
        possibleValuesArrays[key] = Array.from(set).sort(sortAlphanumeric)
    }

    return possibleValuesArrays
}




type Props = {
    rows: Partial<CoolerLP>[],
}

export default function Filters({ rows }: Props) {

    // const header = Object.keys(rows[0])

    const possibleValues = getPossibleValues(rows)

    // console.log(possibleValues)

    // Get filters
    const router = useRouter()
    const { fil: filters } = parseQueryString(router.query)
    /*
    <select>
        <option value="null">-</option>
        {
            Array.from(values).sort(sortAlphanumeric).map((value,i) => (
                <option key={ i } value={ value }>{ value }</option>
            ))
        }
    </select>
    */


    /*
    return (
        <div css={ style }>
            {
                Object.entries(possibleValues).map(([key,values]) => (
                    <label key={ key }>
                        <span>{ key }</span>
                        <Select isMulti closeMenuOnSelect={ values.size<3 } isClearable={ false } options={
                            Array
                            .from(values)
                            .sort(sortAlphanumeric)
                            .map(value => ({ value, label: value }))
                        } onChange={ (value) => handleSelect(key,value) }/>
                    </label>
                ))
            }
        </div>
    )
    */

    return (
        <div css={ style }>
            {
                Object.keys(possibleValues).map((key, headerIndex) => (
                    <Filter
                        label={ key }
                        values={ possibleValues[key] }
                        headerIndex={ headerIndex }
                        filters={ filters }
                        key={ key }
                    />
                ))
            }
            {/* <pre>{ JSON.stringify(possibleValues,null,4) }</pre> */}
        </div>
    )
}

const style = css`
    display: grid;
    flex-wrap: wrap;
    gap: 1em;
    grid-template-columns: repeat(3, 1fr);
    max-height: min(50vh, 500px);
    overflow: auto;
    padding: 1em;
    margin-bottom: 3vh;
    padding-bottom: 10em;
    /* position: relative; */
    /* z-index: 1; */
`