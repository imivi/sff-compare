import { ReactNode } from "react"
import s from "./Filter.module.scss"
import { useFilterStore } from "@/store/useFiltersStore"
import { IconX } from "@tabler/icons-react"

type Props = {
    filterKey: string
    label: string
    highlight: boolean
    children: ReactNode
}

export default function Filter({ filterKey, label, highlight, children }: Props) {

    const resetFilter = useFilterStore(store => store.resetFilter)
    // const resetAllFilters = useFilterStore(store => store.resetAllFilters)

    return (
        <li className={s.container} data-highlight={highlight}>
            <label>
                {highlight && <button className={s.btn_reset_filter}
                    onClick={() => resetFilter(filterKey)}
                // onClick={resetAllFilters}
                >
                    <IconX width={16} height={16} color="white" />
                </button>}
                <span title={label}>{label}</span>
            </label>
            {children}
        </li>
    )
}