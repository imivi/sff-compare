import { api } from "@/api"
import { useSearchStore } from "@/store/useSearchStore"
import { CaseName } from "@/types"
// import { useSearchStore } from "@/store/useSearchStore"
import { useQuery } from "@tanstack/react-query"
import type Fuse from "fuse.js"
import { useMemo, useRef } from "react"

/**
 * Performs a search using Fuse.js on the list of case names
 * and returns an array of results (case ids).
 * @param searchValue 
 */
export function useFuseSearch(searchValue: string, maxResults: number): string[] {

    // const searchValue = useSearchStore(store => store.searchValue)

    const searchEnabled = useSearchStore(store => store.searchEnabled)

    const fuseRef = useRef<Fuse<CaseName>>()

    const getCasesNamesQuery = useQuery({
        queryKey: ["case-names"],
        queryFn: api.getCaseNames,
        enabled: searchEnabled,
    })

    const caseNames = getCasesNamesQuery.data

    useMemo(async () => {
        if (!caseNames) {
            return
        }
        if (!fuseRef.current) {
            const Fuse = (await import("fuse.js")).default
            const fuse = new Fuse(caseNames, {
                keys: ["seller", "case"],
                includeScore: false,
                findAllMatches: false,
            })
            fuseRef.current = fuse
        }
    }, [caseNames])

    const searchResult = useMemo(() => {
        if (!fuseRef.current) {
            return null
        }
        return fuseRef.current.search(searchValue)
    }, [searchValue])

    if (searchResult) {
        return searchResult.map(result => result.item.id).slice(0, maxResults)
    }

    return []
}