import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Select, { type MultiValue } from "react-select"
import { stringifyFilters } from "@/utils/queryString/stringifyFilters"
import { DeserializedFilters, Options } from "@/utils/queryString/deserializeFilters"


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
    label: string,
    values: (string|number)[],
    // headerIndex: number,
    filters: DeserializedFilters,
    // onChange: (selectedOptions: MultiValue<Option>) => unknown,
    options: Options,
}

export default function FilterControl({ label, filters, options, values }: Props) {

    const router = useRouter()

    // const { min, max } = getMinMax(values)

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
        // console.log({ selectedOptions, newFilters, newQuery })
        
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

    return (
        <label css={ style }>
            <span>{ label } ({ options[label].length }) { isNumberColumn(values) && "(slider)" }</span>
            <Select
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
                onChange={ (selectedOptions) => handleSelect(selectedOptions) }/>
        </label>
    )
}

const style = css`
    min-width: 3em;
    /* max-width: 15em; */
    /* width: 20em; */

    & > span {
        color: #555;
        padding: .5em 0;
        margin-bottom: 2em;
    }

    input[type=range] {
        display: block;
    }
`