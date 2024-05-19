import s from "./Sidebar.module.scss"

import { useQueryClient } from "@tanstack/react-query";
import TextFilter from "./TextFilter";
import { IconReload } from "@tabler/icons-react"
import RangeFilter from "./RangeFilter";
import { createFiltersFromQueryString, useFilterStore } from "@/store/useFiltersStore";
import { useLayoutStore } from "@/store/useLayoutStore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useFetchColumns } from "@/hooks/useFetchColumns";
import LoadingSpinner from "./LoadingSpinner";


export default function Sidebar() {

    const show = useLayoutStore(store => store.showSidebar)
    const hideSidebar = useLayoutStore(store => store.hideSidebar)

    const queryClient = useQueryClient()

    const router = useRouter()
    const query = router.query

    const filters = useFilterStore(store => store.filters)
    const toQuery = useFilterStore(store => store.toQuery)
    const dirtyFilters = useFilterStore(store => store.dirtyFilters)
    const clearDirtyFilters = useFilterStore(store => store.clearDirtyFilters)
    const setFilterState = useFilterStore(store => store.setFilterState)
    const applySearchFilters = useFilterStore(store => store.applyFilters)

    const { data: columns, loading, error } = useFetchColumns()

    const { resultsPerPage, sort } = useQueryParams()

    if (loading || error) {
        <div className={s.container} data-show={false} />
    }

    function applyFilters() {
        queryClient.invalidateQueries({ queryKey: ["cases"] })
        applySearchFilters()
        clearDirtyFilters()

        if (window.innerWidth < 960) {
            hideSidebar()
        }
    }

    // Whenever the query string changes, parse and load the filters state
    useEffect(() => {
        if (columns && columns.length > 0) {
            if (Object.keys(filters).length === 0) {
                const filters = createFiltersFromQueryString(query, columns)
                Object.keys(filters).map(filterKey => {
                    setFilterState(filterKey, filters[filterKey])
                })
                applyFilters()
            }
        }
    }, [columns, query, filters, setFilterState, queryClient])

    return (
        <>
            <div className={s.container} data-show={show}>

                <ul className={s.filters}>
                    {
                        columns?.map(col => (
                            <div key={col.label}>
                                {
                                    col.numerical
                                        ? <RangeFilter columnMetadata={col} />
                                        : <TextFilter columnMetadata={col} />
                                }
                            </div>
                        ))
                    }
                </ul>

                <footer data-show={dirtyFilters.size > 0}>
                    <Link
                        onClick={applyFilters}
                        data-disabled={dirtyFilters.size === 0}
                        href={{
                            query: {
                                // ...router.query,
                                results: resultsPerPage,
                                sort: sort ? `${sort.key},${sort.ascending ? 1 : -1}` : "case,-1",
                                ...toQuery(),
                                page: 1,
                            }
                        }}>
                        <IconReload size={16} /> Update results
                    </Link>
                    {/* <small>
                        {activeFilters === 0 ? "No active filters" : `${activeFilters} active filters`}
                    </small> */}

                </footer>
            </div>
        </>
    )
}
