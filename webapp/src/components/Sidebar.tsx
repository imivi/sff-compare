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

    const { data: columns, loading, error } = useFetchColumns()

    const { resultsPerPage, sort } = useQueryParams()

    // Whenever the query string changes, parse and load the filters state
    useEffect(() => {
        // console.log("New query string:", query)
        if (columns && columns.length > 0 && Object.keys(filters).length === 0) {
            const filters = createFiltersFromQueryString(query, columns)
            // console.log("Loading filters from query string", query, 'filters:', filters)
            Object.keys(filters).map(filterKey => {
                // console.log("Setting filter:", filterKey, filters[filterKey])
                setFilterState(filterKey, filters[filterKey])
            })
            queryClient.invalidateQueries({ queryKey: ["cases"] })
        }
    }, [columns, query, filters, setFilterState, queryClient])

    if (loading || error) {
        return null
    }

    function applyFilters() {
        queryClient.invalidateQueries({ queryKey: ["cases"] })

        clearDirtyFilters()
        if (window.innerWidth < 960) {
            hideSidebar()
        }
    }

    const activeFilters = Object.keys(filters).length


    return (
        <>
            <div className={s.container} data-show={show}>

                <ul className={s.filters}>
                    {/* <pre style={{ height: 400, overflow: "auto" }}>{JSON.stringify(filters, null, 4)}</pre> */}
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
                    <small>
                        {activeFilters === 0 ? "No active filters" : `${activeFilters} active filters`}
                    </small>

                </footer>
            </div>
        </>
    )
}
