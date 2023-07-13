import { CoolerLP } from "@/types"
import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Select, { type MultiValue } from "react-select"
import { Query, parseQueryString } from "@/utils/queryString/parseQueryString"
import Filter from "./unused/Filter"
import Slider from "./slider/MultiSlider"
import MultiSlider from "./slider/MultiSlider"
import { Options } from "@/utils/queryString/deserializeFilters"
import FilterControl from "./FilterControl"
import { useState } from "react"
import { CaretDown, CaretUp, ChevronDown, ChevronRight } from "tabler-icons-react"


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



/**
 * Options that should be hidden in the sidebar
 */
const blacklist = new Set([
    "Remarks",
])

const hiddenFilters = new Set([
    "AMD FM1 / FM2(+) / AM2(+) / AM3(+)",
    "AMD AM4 / AM5",
    "Intel 115X / 1200",
    "Intel 1366",
    "Intel 1700",
    "Intel 2011 / 2066",
    "Intel 775",
    "Heatsink Material",
])



type Props = {
    // rows: Partial<CoolerLP>[],
    query: Query,
    options: Options,
}

export default function Sidebar({ query, options }: Props) {

    const [showAllOptions, setShowAllOptions] = useState(false)

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

    // console.log("Filters:", query.fil)

    const basicOptions  = Object.keys(options).filter(option => !hiddenFilters.has(option)).sort()
    const hiddenOptions = showAllOptions ? Object.keys(options).filter(option => hiddenFilters.has(option)).sort() : []

    return (
        <div css={ style }>

            <h1>SFF Compare</h1>
            
            {/* <MultiSlider domain={ [0,10] } minValue={ 1 } maxValue={ 10 } tickCount={ 1 } onChange={ (values) => console.log(values) }/> */}
            {
                [...basicOptions, ...hiddenOptions]
                    .filter(optionLabel => !blacklist.has(optionLabel))
                    .map(optionLabel => (
                        <FilterControl
                            label={ optionLabel }
                            values={ options[optionLabel] }
                            options={ options }
                            // headerIndex={ headerIndex }
                            filters={ query.fil }
                            ranges={ query.r }
                            key={ optionLabel }
                        />
                    ))
            }
            {/* <pre>{ JSON.stringify(possibleValues,null,4) }</pre> */}

            <button className="btn-show-more" onClick={ () => setShowAllOptions(!showAllOptions) }>
                {/* { showAllOptions ? <ChevronRight size={ 18 }/> : <ChevronDown size={ 18 }/> } */}
                { showAllOptions ? "Show fewer options" : "Show more options" }
            </button>
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
    /* gap: 1em; */
    /* grid-template-columns: repeat(3, 1fr); */
    /* max-height: min(50vh, 500px); */
    /* overflow: auto; */
    padding: 1em;
    /* margin-bottom: 3vh; */
    /* padding-bottom: 10em; */
    width: 100%;
    /* position: relative; */
    /* z-index: 1; */
    position: relative;

    .btn-show-more {
        margin: 1em auto;
        font-size: .9em;
        font-family: inherit;
        padding: .5em;
        background-color: #0077ff;
        border: none;
        border-radius: .3em;
        color: white;
        position: relative;
        z-index: 10;
        display: flex;
        cursor: pointer;

        &:hover {
            opacity: .8;
        }
    }
`