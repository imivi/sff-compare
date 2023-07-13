import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Select, { type MultiValue } from "react-select"
import { stringifyFilters } from "@/utils/queryString/stringifyFilters"
import { DeserializedFilters, Options } from "@/utils/queryString/deserializeFilters"
import { Range, stringifyRange } from "@/utils/queryString/range"
import { useMemo, useState } from "react"
import MultiSlider from "./slider/MultiSlider"


type Option = {
    value: number,
    label: string|number,
}


function isNumberColumn(values: (string|number)[]) {
    return values.some(value => typeof value === "number")
}

function getMinMax(values: (string|number)[]): { min: number, max: number } {
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
    filters: DeserializedFilters
    ranges: Record<string, Range>
    // onChange: (selectedOptions: MultiValue<Option>) => unknown
    options: Options
}

export default function FilterControl({ label, filters, ranges, options, values }: Props) {

    const [sliderValues, setSliderValues] = useState<readonly number[]>([])
    
    const router = useRouter()


    // If the header index is in filters (from the query string),
    // read the selected options. Otherwise, "selected options" is empty
    // const selectedOptionsIndices = headerIndex in filters ? filters[headerIndex] : []
    // const options = values.map((value,i) => ({ label: value, value: i }))
    // const selectedOptions = selectedOptionsIndices.map(index => options[index])


    function handleSelect(selectedOptions: MultiValue<Option>) {

        // const selectedOptionsIndices = selectedOptions.map(option => option.value)

        // filters[headerIndex] = selectedOptionsIndices

        const newFilters: DeserializedFilters = {
            ...filters,
            [label]: selectedOptions.map(option => option.label)
        }

        const newQuery = {
            ...router.query,
            fil: stringifyFilters(newFilters,options),
        }
        // console.log({ label, selectedOptions, oldFilters: filters, newFilters, newQuery, options })
        
        router.replace({
            query: newQuery,
        })
    }


    let selectedOptions: { label: string, value: number }[] | null = null
    if(options[label] && filters[label]) {
        // const optionsLabels = options[label]
        
        selectedOptions = options[label]
        .filter(option => filters[label].includes(option))
        .map((option,i) => ({ label: option.toString(), value: i }))
        
        // console.log(label, options[label], filters[label], selectedOptions)
    }

    const selectOptions = options[label].map((label,i) => ({ label: label.toString(), value: i }))

    const isNumericalOption = useMemo(() => values.length > 3 && isNumberColumn(values), [values])

    // console.log(values,isNumericalOption)


    const { min, max } = useMemo(() => getMinMax(values), [values])


    function handleChange(values: readonly number[]) {

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
            r: stringifyRange(newRanges, options),
        }

        // console.log(values, newQuery)

        if(typeof document !== "undefined") {
            router.replace({
                query: newQuery,
            })
        }
    }

    if(isNumericalOption) {
        
        const selectedRange = label in ranges ? ranges[label] : undefined

        // console.log(label, ranges, selectedRange)
        
        return <div css={ style } data-outline={ false }>

            <div>
                <div className="label">{ label }</div>
                <label>
                    <input type="checkbox"/>
                    <small> Include unknown</small>
                </label>
            </div>

            <div className="slider">
                <small>{ sliderValues[0] } - { sliderValues[1] }</small>
                <MultiSlider
                    domain={ [min, max] }
                    minValue={ selectedRange?.min || min }
                    maxValue={ selectedRange?.max || max }
                    onChange={ (values) => handleChange(values) }
                    tickCount={ Math.min(values.length+1, 5) }
                    onDrag={ (values) => setSliderValues(values) }
                />
            </div>
        </div>
    }

    return (
        <label css={ style } data-is-numerical={ isNumericalOption }>
            <span className="label" title={ label }>{ label }</span>
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