import { css } from "@emotion/react"
import { useRouter } from "next/router"
import { stringifyFilters } from "@/utils/queryString/stringifyFilters"
import { DeserializedFilters } from "@/utils/queryString/deserializeFilters"
import { stringifyRange } from "@/utils/queryString/range"
import { useEffect, useMemo, useState } from "react"
import DualSlider from "./slider/DualSlider"
import { Query } from "@/utils/queryString/query"
import { Options } from "@/utils/Options"
import MultiSelect, { SelectOption } from "./utility/MultiSelect"


// type SelectOption = {
//     value: number,
//     label: string|number,
// }


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
    category: string
    // key_: string|number
}

export default function FilterControl({ category, label, query, options, values }: Props) {

    const router = useRouter()

    const { min, max } = useMemo(() => getMinMax(values), [values])

    const ranges = query.r
    const filters = query.fil
    
    const selectedRangeMin = ranges.hasOwnProperty(label) ? ranges[label].min : min
    const selectedRangeMax = ranges.hasOwnProperty(label) ? ranges[label].max : max
    // const [sliderValues, setSliderValues] = useState<[number,number]>([selectedRange.min, selectedRange.max])

    const [sliderValueMin, setSliderValueMin] = useState(min)
    const [sliderValueMax, setSliderValueMax] = useState(max)
    
    const step = (max-min > 10) ? 1 : 0.1
    const isNumericalOption = values.length > 3 && options.isNumerical(label)
    const decimals = (max-min < 3) ? 1 : 0

    let selectedOptions: SelectOption[] = []
    const selectOptions = options
        .getValues(label)
        .map((label,i) => ({ label: label.toString(), value: i }))
        // .sort((a,b) => a.label < b.label ? -1 : 1)

    for(const optionKey of filters[label] || []) {
        if(optionKey) {
            const index = options.indexOf(label, optionKey)

            if(index != null) {
                const option = { label: optionKey.toString(), value: index }
                selectedOptions.push(option)
            }
        }
        else {
            console.info("ERROR", label, { optionKey, options, filters: filters[label] })
        }
    }

    /*
    useEffect(() => {
        if(!ranges.hasOwnProperty(label)) {
            // const { min, max } = ranges[label]
            const values = options.getValues(label)
            const { min, max } = getMinMax(values)
            setSliderValueMin(min)
            setSliderValueMin(max)
        }
    }, [min, max, setSliderValueMin, setSliderValueMax, label, ranges, options])
    */

    function handleSelect(newSelectedOptions: SelectOption[]) {
        const newFilters: DeserializedFilters = {
            ...filters,
            [label]: newSelectedOptions.map(option => option.label)
        }

        // console.info("newFilters:", newFilters)

        const newQuery = {
            ...router.query,
            fil: stringifyFilters(newFilters,options.values),
        }

        router.replace({
            query: newQuery,
        })
    }


    function handleChange(values: number[]) {

        // if(typeof document === "undefined") {
        //     return
        // }

        // if(!ranges.hasOwnProperty(label)) {
        //     console.log("Setting range in query because it's empty")
        //     handleChange(values)
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
        else {
            console.info("document undefined")
        }
    }

    function handleDrag(values: [number,number]) {
        // setSliderValues([...values])
        console.log("(Drag) setting new slider values:", values)
        setSliderValueMin(values[0])
        setSliderValueMax(values[1])
        if(!ranges) {
            handleChange(values)
        }
    }

    // Render a slider
    if(isNumericalOption) {
        return <div css={ style } data-outline={ false }>

            <div>
                <div className="label" title={ JSON.stringify({
                    // key_,
                    min,
                    max,
                    selectedRangeMin,
                    selectedRangeMax,
                    sliderValueMin,
                    sliderValueMax,
                    controlled: ranges.hasOwnProperty(label),
                    category,
                    // values: (ranges.hasOwnProperty(label) ? sliderValues : [min,max])
                }, null, 4)}>
                    { label }
                </div>
                {/* TODO: add feature */}
                {/* <label>
                    <input type="checkbox"/>
                    <small> Include unknown</small>
                </label> */}
            </div>

            <div className="slider">
                {/* <div>Key: { key_ }</div> */}
                {/* <div>controlled: { ranges.hasOwnProperty(label).toString() }</div> */}

                <DualSlider
                    category={ category }
                    rangeMin={ min }
                    rangeMax={ max }
                    // valueMin={ sliderValueMin }
                    valueMin={ ranges.hasOwnProperty(label) ? sliderValueMin : min }
                    // valueMax={ sliderValueMax }
                    valueMax={ ranges.hasOwnProperty(label) ? sliderValueMax : max }
                    controlled={ ranges.hasOwnProperty(label) }
                    step={ step }
                    onChange={ (values) => handleChange(values) }
                    tickCount={ Math.min(values.length+1, 5) }
                    // While the slider is dragged, update the indicators above it.
                    // If there is no query string for the current range, create it.
                    onDrag={ handleDrag }
                    decimals={ decimals }
                />
            </div>
        </div>
    }

    // Render a dropdown menu
    return (
        <label css={ style } data-is-numerical={ isNumericalOption }>
            <span className="label" title={ JSON.stringify({
                values,
                selectedOptions,
                filters,
            }, null, 4) }>
                { label }
            </span>
            <MultiSelect
                closeMenuOnSelect={ values.length < 3 }
                options={ selectOptions }
                values={ selectedOptions }
                onChange={ (selectedOptions) => handleSelect(selectedOptions) }
                category={ category }
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
        /* z-index: 1; */
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