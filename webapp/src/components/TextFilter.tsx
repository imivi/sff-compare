import { IconCross, IconX } from "@tabler/icons-react"
import { useFilterStore } from "../store/useFiltersStore"
import { ColumnMetadataTextual } from "../types"
import s from "./TextFilter.module.scss"
import Filter from "./Filter"

type Props = {
    columnMetadata: ColumnMetadataTextual,
}

export default function TextFilter({ columnMetadata }: Props) {

    const state = useFilterStore(store => store.filters[columnMetadata.key])
    const selectOption = useFilterStore(store => store.selectOption)
    const deselectOption = useFilterStore(store => store.deselectOption)

    function allOptionsAreSelected() {
        if (!state) {
            return false
        }
        return !state.numerical && state.options.length === columnMetadata.options.length
    }

    let unselectedOptions = columnMetadata.options
    if (state && !state.numerical) {
        unselectedOptions = columnMetadata.options.filter(opt => !state.options.includes(opt))
    }

    // Move the "-" option to the start of the list
    // const optionIndex = unselectedOptions.findIndex(opt => opt === "-")
    if (unselectedOptions.find(opt => opt === "-")) {
        unselectedOptions = ["-", ...unselectedOptions.filter(opt => opt !== "-")]
    }

    const adjusted = !state?.numerical && state?.options?.length > 0

    return (
        <Filter filterKey={columnMetadata.key} highlight={adjusted} label={columnMetadata.label}>
            <div className={s.container} data-adjusted={adjusted}>
                <select
                    onChange={(e) => { e.stopPropagation(); selectOption(columnMetadata.key, e.target.value) }}
                    value="?"
                    disabled={allOptionsAreSelected()}
                >
                    <option value="?">Select...</option>
                    {
                        unselectedOptions.map(option => (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))
                    }
                </select>
                {state &&
                    <ul>
                        {
                            !state.numerical && state.options.map(opt => (
                                <li key={opt}>
                                    <span title={opt}>{opt}</span>
                                    <button style={{ display: "inline-block" }} onClick={() => deselectOption(columnMetadata.key, opt)}>
                                        <IconX size={16} color="white" />
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                }
            </div>
        </Filter>
    )
}