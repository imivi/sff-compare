import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Select, { type MultiValue } from "react-select"
import { Filters, serializeFilters } from "@/utils/queryString/stringifyFilters"


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
    headerIndex: number,
    filters: Filters,
    // onChange: (selectedOptions: MultiValue<Option>) => unknown,
}

export default function Filter({ values, label, headerIndex, filters }: Props) {

    const router = useRouter()

    const { min, max } = getMinMax(values)

    // if(isNumberColumn(values)) {
    //     return <label css={ style }>
    //         <span>{ label }</span>
    //         <input type="range" min={ min } max={ max }/>
    //     </label>
    // }

    // If the header index is in filters (from the query string),
    // read the selected options. Otherwise, "selected options" is empty
    const selectedOptionsIndices = headerIndex in filters ? filters[headerIndex] : []
    const options = values.map((value,i) => ({ label: value, value: i }))
    const selectedOptions = selectedOptionsIndices.map(index => options[index])


    function handleSelect(selectedOptions: MultiValue<Option>, headerIndex: number) {

        const selectedOptionsIndices = selectedOptions.map(option => option.value)

        filters[headerIndex] = selectedOptionsIndices

        const newQuery = {
            ...router.query,
            fil: serializeFilters(filters)
        }
        // console.log({ selectedOptions, newQuery })
        
        router.replace({
            query: newQuery,
        })
    }

    return (
        <label css={ style }>
            <span>{ label } ({ options.length }) { isNumberColumn(values) && "(slider)" }</span>
            <Select
                instanceId="react-select-id"
                isMulti
                closeMenuOnSelect={ values.length < 3 }
                // isClearable={ false }
                options={ options }
                value={ selectedOptions }
                // defaultValue={ options }
                // value={ options.map(option => option.value===1 || selectedOptions.includes(option.value)) }
                // isOptionSelected={ (option) =>  }
                onChange={ (selectedOptions) => handleSelect(selectedOptions, headerIndex) }/>
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