import { CoolerLP } from "@/types"
import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Select, { type MultiValue } from "react-select"
import { serializeFilters } from "@/utils/queryString/serializeFilters"
import { Query, parseQueryString } from "@/utils/queryString/parseQueryString"
import Filter from "./Filter"
import Slider from "./slider/MultiSlider"
import MultiSlider from "./slider/MultiSlider"
import { Options } from "@/utils/queryString/deserializeFilters"


type Option = {
    value: number,
    label: string|number,
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





type Props = {
    // rows: Partial<CoolerLP>[],
    query: Query,
    options: Options,
}

export default function FilterControls({ query, options }: Props) {

    // const header = Object.keys(rows[0])

    // console.log(possibleValues)

    // Get filters
    // const router = useRouter()
    // const { fil: filters } = parseQueryString(router.query)
    // const { fil: filters } = query
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
            <MultiSlider domain={ [0,10] } minValue={ 1 } maxValue={ 10 } tickCount={ 1 } onChange={ (values) => console.log(values) }/>
            {
                Object.keys(options).map((key, headerIndex) => (
                    <Filter
                        label={ key }
                        values={ options[key] }
                        headerIndex={ headerIndex }
                        filters={ query.fil }
                        key={ key }
                    />
                ))
            }
            {/* <pre>{ JSON.stringify(possibleValues,null,4) }</pre> */}
        </div>
    )
}

const style = css`
    /* display: grid; */
    display: flex;
    flex-direction: column;
    /* min-height: 100vh; */
    /* height: 100vh; */
    overflow-x: hidden;
    overflow-y: auto;
    /* position: fixed; */
    /* left: 0; */
    /* top: 0; */
    /* max-width: 500px; */
    /* border: 1px solid brown; */
    /* flex-wrap: wrap; */
    gap: 1em;
    /* grid-template-columns: repeat(3, 1fr); */
    /* max-height: min(50vh, 500px); */
    /* overflow: auto; */
    padding: 1em;
    /* margin-bottom: 3vh; */
    /* padding-bottom: 10em; */
    width: 100%;
    /* position: relative; */
    /* z-index: 1; */
`