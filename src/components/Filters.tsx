import { CoolerLP } from "@/types"
import { css } from "@emotion/react"
import { useRouter } from "next/router"
import Link from "next/link"
import { compareValues } from "@/utils/compareValues"
import Select, { type MultiValue } from "react-select"
import { deserializeFilters } from "@/utils/filters/deserializeFilters"
import { serializeFilters } from "@/utils/filters/serializeFilters"


type Option = {
    value: number,
    label: string|number,
}

function sortAlphanumeric(a: string|number, b: string|number): number {
    return (a.toString()).localeCompare(b.toString())
}


type Props = {
    rows: Partial<CoolerLP>[],
}


type Sort = {
    col: number
    asc: boolean, // ascending order if true (default)
}

export default function Filters({ rows }: Props) {

    // const header = Object.keys(rows[0])

    const possibleValues: Record<string,Set<string|number>> = {}

    // possibleValues["example"] = new Set<string|number>()
    // possibleValues["example"].add(1)
    // possibleValues["example"].add(2)
    // possibleValues["example"].add("dfgjkl")

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

    // console.log(possibleValues)

    // Get filters
    const router = useRouter()

    const filterQuery = router.query?.fil || router.query?.fil

    const filters = typeof filterQuery === "string" ? deserializeFilters(filterQuery) : {}

    // console.log({ filterQuery, filters })

    // Extract filters from query string
    // f=0:1,2;10:3,4 -> header 0 has options 1 & 2; header 10 has options 3 & 4
    // const currentFilters = []
    // const headerFilters = filterQuery.split(";")
    //     .map(str => {
    //         const [headerKey, optionKeys] = headerFilters
    //     })
    

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

    function handleSelect(selectedOptions: MultiValue<Option>, headerIndex: number) {

        // const selectedOption = selectedOptions[0]

        // const selectedOptionsIndices = selectedOptions.map(option => allOptions[option.value].value)
        // console.log({ selectedOptionsIndices })


        // const selectedOptionIndex = allOptions.indexOf(selectedOption.value)

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

    // const possibleValuesArrays: [string,(string|number)[]][] = []
    const possibleValuesArrays: Record<string, (string|number)[]> = {}

    for(const [key,set] of Object.entries(possibleValues)) {
        // possibleValuesArrays.push([key, Array.from(set)])
        possibleValuesArrays[key] = Array.from(set).sort(sortAlphanumeric)
    }

    return (
        <div css={ style }>
            {
                Object.entries(possibleValuesArrays)
                    // .sort((a,b) => sortAlphanumeric(a,))
                    .map(([key,values], headerIndex) => {

                    // If the header index is in filters (from the query string),
                    // read the selected options. Otherwise, "selected options" is empty
                    const selectedOptionsIndices = headerIndex in filters ? filters[headerIndex] : []

                    const options = values
                        .map((value,i) => ({ label: value, value: i }))
                        // .sort((a,b) => a.value < b.value ? -1 : 1)

                    const selectedOptions = selectedOptionsIndices.map(index => options[index])

                    // if(selectedOptionsIndices.length > 0) {
                    //     console.log({ selectedOptionsIndices, selectedOptions })
                    // }

                    return <label key={ key }>
                        <span>{ key } ({ headerIndex })</span>
                        <Select
                            instanceId="react-select-id"
                            isMulti
                            closeMenuOnSelect={ values.length < 3 }
                            isClearable={ false }
                            options={ options }
                            value={ selectedOptions }
                            // defaultValue={ options }
                            // value={ options.map(option => option.value===1 || selectedOptions.includes(option.value)) }
                            // isOptionSelected={ (option) =>  }
                            onChange={ (selectedOptions) => handleSelect(selectedOptions, headerIndex) }/>
                    </label>
                })
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

    label {
        min-width: 3em;
        /* max-width: 15em; */
        /* width: 20em; */

        & > span {
            color: #555;
            padding: .5em 0;
            margin-bottom: 2em;
        }
    }
`