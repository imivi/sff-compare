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
import { Box, CaretDown, CaretUp, ChevronDown, ChevronRight } from "tabler-icons-react"
import Footer from "./Footer"
import { Pages, blacklist, googleSheetsTabs, hiddenFilters } from "@/utils/googleSheetsUrls"
import Image from "next/image"
import Logo from "../../public/cube.png"
import { GithubLink } from "./GithubLink"


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

export default function Sidebar({ query, options }: Props) {

    const router = useRouter()

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

    // const pages = Object.keys(googleSheetsTabs)
    // const pageLinks = pages.map(key => googleSheetsTabs[key])

    return (
        <div css={ style }>

            <div>
                <h1>
                    <GithubLink/>
                    {/* <Box size={ 40 } strokeWidth={1}/> */}
                    <Image src={ Logo } alt="SFF Compare logo" width={ 32 }/>
                    SFF Compare
                </h1>

                <div className="controls">

                    <select onChange={ (e) => router.push(e.target.value) }>
                        {
                            Object.keys(googleSheetsTabs).map((page,i) => (
                                <option value={ "/"+page } key={ i }>
                                    { googleSheetsTabs[page] }
                                </option>
                            ))
                        }
                    </select>
                    
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
            </div>

            <Footer/>
        </div>
    )
}

const style = css`
    /* display: grid; */
    /* min-height: 100vh; */
    /* height: 100vh; */
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
    /* margin-bottom: 3vh; */
    /* padding-bottom: 10em; */
    width: 100%;
    height: 100%;
    /* position: relative; */
    /* z-index: 1; */
    /* position: relative; */
    background-color: #f4f4f4;

    border-right: 1px solid #ddd;
    box-shadow: 5px 0 15px rgba(0,0,0, 0.1);

    display: grid;
    grid-template-rows: 1fr auto;

    overflow-y: auto;


    & > div {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
        height: 100%;
    }

    h1 {
        display: flex;
        place-content: center;
        place-items: center;
        gap: .3em;
        font-weight: normal;
        padding: 1em;
        margin: 0;
        position: relative;
    }

    .controls {
        padding: 0 1em;
    }

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