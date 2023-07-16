import { css } from "@emotion/react"
import { useRouter } from "next/router"
import FilterControl from "./FilterControl"
import { useState } from "react"
import Footer from "./Footer"
import { blacklist, hiddenFilters } from "@/utils/googleSheetsUrls"
import Image from "next/image"
import Logo from "../../public/cube.png"
import { GithubLink } from "./GithubLink"
import Link from "next/link"
import { pages, tabNames } from "@/data"
import { Query } from "@/utils/queryString/query"
import { Options } from "@/utils/Options"
import Button from "./utility/Button"
import Select from "./utility/Select"


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

    const basicOptions  = options.getKeys().filter(option => !hiddenFilters.has(option)).sort()
    const hiddenOptions = options.getKeys().filter(option => hiddenFilters.has(option)).sort()

    // const pages = Object.keys(googleSheetsTabs)
    // const pageLinks = pages.map(key => googleSheetsTabs[key])

    return (
        <div css={ style }>

            <div>
                <h1>
                    <GithubLink/>
                    {/* <Box size={ 40 } strokeWidth={1}/> */}
                    <Image src={ Logo } alt="SFF Compare logo" width={ 32 }/>
                    <Link href={ "/"+pages[0] }>SFF Compare</Link>
                </h1>

                {
                    process.env.NODE_ENV === "development" &&
                    <Button onClick={ () => console.info(options) }>Log options</Button>
                }

                <div className="controls">

                    <Select onChange={ (e) => router.push(e.target.value) }>
                        {
                            Object.entries(tabNames).map(([page,tabName]) => (
                                <option value={ "/"+page } key={ page }>
                                    { tabName }
                                </option>
                            ))
                        }
                    </Select>
                    
                    {/* <MultiSlider domain={ [0,10] } minValue={ 1 } maxValue={ 10 } tickCount={ 1 } onChange={ (values) => console.log(values) }/> */}
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

        a {
            color: inherit;
            text-decoration: inherit;
        }
    }

    .controls {
        padding: 0 1em;
    }

`