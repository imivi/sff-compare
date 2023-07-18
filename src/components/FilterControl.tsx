import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Select, { type MultiValue } from "react-select"
import { stringifyFilters } from "@/utils/queryString/stringifyFilters"
import { DeserializedFilters } from "@/utils/queryString/deserializeFilters"
import { stringifyRange } from "@/utils/queryString/range"
import { useMemo, useState } from "react"
import DualSlider from "./slider/DualSlider"
import { Query } from "@/utils/queryString/query"
import { Options } from "@/utils/Options"


type SelectOption = {
    value: number,
    label: string|number,
}


function getMinMax(values: (string|number)[]): { min: number, max: number } {

    if(!values) {
        return {
            min: 0,
            max: 0,
        }
    }
    
    let min = null
    let max = null

    const numValues = values.filter(value => typeof value === "number").map(value => Number(value))
    
    for(const value of numValues) {
        if(!min || value < min) {
            min = value
        }
        if(!max || value > max) {
            max = value
        }
    }

    return {
        min: min || numValues[0],
        max: max || numValues[0],
    }
}



type Props = {
    label: string
    values: (string|number)[]
    // headerIndex: number
    // filters: DeserializedFilters
    // ranges: Record<string, Range>
    query: Query
    // onChange: (selectedOptions: MultiValue<Option>) => unknown
    options: Options
}

export default function FilterControl({ label, query, options, values }: Props) {

    const router = useRouter()

    const { min, max } = useMemo(() => getMinMax(values), [values])

    // console.log({ min, max })

    const ranges = query.r
    const filters = query.fil
    
    const selectedRange = label in ranges ? ranges[label] : { min, max }
    const [sliderValues, setSliderValues] = useState<[number,number]>([selectedRange.min, selectedRange.max])
    


    const step = (max-min > 10) ? 1 : 0.1
    // const step = 1

    const decimals = (max-min < 3) ? 1 : 0

    // If the header index is in filters (from the query string),
    // read the selected options. Otherwise, "selected options" is empty
    // const selectedOptionsIndices = headerIndex in filters ? filters[headerIndex] : []
    // const options = values.map((value,i) => ({ label: value, value: i }))
    // const selectedOptions = selectedOptionsIndices.map(index => options[index])


    function handleSelect(newSelectedOptions: MultiValue<SelectOption>) {

        // const selectedOptionsIndices = selectedOptions.map(option => option.value)

        // filters[headerIndex] = selectedOptionsIndices

        const newFilters: DeserializedFilters = {
            ...filters,
            [label]: newSelectedOptions.map(option => option.label)
        }

        const newQuery = {
            ...router.query,
            fil: stringifyFilters(newFilters,options.values),
        }
        // console.log({ label, selectedOptions, oldFilters: filters, newFilters, newQuery, options })
        
        router.replace({
            query: newQuery,
        })
    }


    // const sel = query.fil

    // console.log({ options })

    let selectedOptions: { label: string, value: number }[] = []

    const selectedOptionLabels = query.fil[label] || []
        for(const optionKey of selectedOptionLabels) {
        const index = options.indexOf(label, optionKey)
        selectedOptions.push({ label: optionKey.toString(), value: index })
    }

    /*
    let selectedOptions: { label: string, value: number }[] | null = null
    if(options.getValues(label) && filters[label]) {
        // const optionsLabels = options[label]
        
        selectedOptions = options.getValues(label)
            .filter(option => filters[label].includes(option))
            .map((option,i) => ({ label: option.toString(), value: i }))
        
        // console.log(label, options[label], filters[label], selectedOptions)
    }
    */

    const selectOptions = options.getValues(label).map((label,i) => ({ label: label.toString(), value: i }))

    const isNumericalOption = values.length > 3 && options.isNumerical(label)
    // const isNumericalOption = useMemo(() => values.length > 3 && isNumberColumn(values), [values])

    // console.log(values,isNumericalOption)




    function handleChange(values: number[]) {

        // if(typeof document === "undefined") {
        //     return
        // }

        const newRanges = { ...ranges }
        
        // Delete the current slider values if they are the default min/max range
        if(values[0] === min && values[1] === max) {
            delete newRanges[label]
        }
        // Add the values to the query string
        else {
            newRanges[label] = {
                min: values[0],
                max: values[1],
                includeUnknown: false,
            }
        }

        const newQuery = {
            ...router.query,
            r: stringifyRange(newRanges, options.values),
        }

        // console.log(values, newQuery)

        if(typeof document !== "undefined") {
            router.replace({
                query: newQuery,
            })
        }
    }

    // Render a slider
    if(isNumericalOption) {
        return <div css={ style } data-outline={ false }>

            <div>
                <div className="label" title={ JSON.stringify({min,max,selectedRange,sliderValues},null,4) }>{ label }</div>
                {/* TODO: add feature */}
                {/* <label>
                    <input type="checkbox"/>
                    <small> Include unknown</small>
                </label> */}
            </div>

            <div className="slider">
                <small>
                    { sliderValues.map(value => value.toFixed(decimals)).join(" - ") }
                </small>
                {/* <MultiSlider
                    domain={ [min, max] }
                    minValue={ selectedRange?.min || min }
                    maxValue={ selectedRange?.max || max }
                    onChange={ (values) => handleChange(values) }
                    tickCount={ Math.min(values.length+1, 5) }
                    onDrag={ (values) => setSliderValues(values) }
                /> */}
                <DualSlider
                    range={ [min, max] }
                    values={ ranges[label] ? sliderValues : undefined }
                    step={ step }
                    onChange={ (values) => handleChange(values) }
                    tickCount={ Math.min(values.length+1, 5) }
                    // While the slider is dragged, update the indicators above it.
                    // If there is no query string for the current range, create it.
                    onDrag={ (values) => { setSliderValues(values); if(!ranges[label]) handleChange(values) } }
                />
            </div>
        </div>
    }

    // Render a dropdown menu
    return (
        <label css={ style } data-is-numerical={ isNumericalOption }>
            <span className="label" title={ JSON.stringify({ values, selectedOptions }, null, 4) }>
                { label }
            </span>
            <Select
                className="select-container"
                instanceId="react-select-id"
                isMulti
                closeMenuOnSelect={ values.length < 3 }
                // isClearable={ false }
                // options={ dummyValues }
                options={ selectOptions }
                // value={ [dummyValues[0]] }
                value={ selectedOptions }
                // defaultValue={ options }
                // value={ options.map(option => option.value===1 || selectedOptions.includes(option.value)) }
                // isOptionSelected={ (option) =>  }
                onChange={ (selectedOptions) => handleSelect(selectedOptions) }
            />
        </label>
    )
}

const style = css`
    display: grid;
    gap: .5em;
    grid-template-columns: 8rem 1fr;
    position: relative;
    align-items: center;
    /* display: flex; */
    /* flex-direction: row; */
    /* max-width: 15em; */
    /* width: 20em; */
    padding: .5em 0;
    position: relative;

    border-top: 1px solid #ddd;
    /* padding: 1rem 0; */

    &[data-outline=true] {
        /* padding: .5em; */
        /* border: 1px solid #ddd; */
    }

    &[data-is-numerical=false] {
        position: relative;
        z-index: 100;
    }

    .label {
        color: #555;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow-x: hidden;
        /* padding: .5em 0; */
    }

    small {
        color: #777;
    }

    input[type=range] {
        display: block;
    }

    .select-container {
        position: relative;
        z-index: 0;
        & > div {
            position: relative;
            z-index: 100;
        }
    }

    .slider {
        max-height: 80px;
        text-align: center;
    }
`