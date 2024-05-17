import { ColumnMetadata } from "@/types"
import { create } from "zustand"

type NumericalFilterState = {
    // active: boolean
    numerical: true
    min: number
    max: number
}

type TextualFilterState = {
    // active: boolean
    numerical: false
    options: string[]
}

type FilterState = NumericalFilterState | TextualFilterState

export type Filters = Record<string, FilterState>

type Store = {
    filters: Filters

    // getFilterState: (key: string) => FilterState | undefined,
    setFilterState: (key: string, state: FilterState) => void,

    selectOption: (key: string, option: string) => void,
    deselectOption: (key: string, option: string) => void,

    setFilterMin: (key: string, value: number, defaultMin: number, defaultMax: number) => void,
    setFilterMax: (key: string, value: number, defaultMin: number, defaultMax: number) => void,

    toQuery: () => Record<string, string>,
    // loadFiltersFromQueryString: (query: Record<string, string | string[] | undefined>, columnMetadata: ColumnMetadata[]) => void,

    resetFilter: (key: string) => void,
    resetAllFilters: () => void,

    dirtyFilters: Set<string>,
    clearDirtyFilters: () => void,
}

export const useFilterStore = create<Store>((set, get) => ({
    filters: {},
    dirtyFilters: new Set<string>(),

    // getFilterState: (key: string) => {
    //     return get().filters[key]
    // }

    setFilterState: (key: string, state: FilterState) => {
        return set({
            filters: {
                ...get().filters,
                [key]: state,
            },
            dirtyFilters: get().dirtyFilters.add(key),
        })
    },

    resetAllFilters: () => {
        console.log("resetAllFilters")
        set({
            filters: {
                "dummy": { min: 1, max: 2, numerical: true }
            }
        })
    },

    resetFilter: (key: string) => {
        const oldFilters = get().filters
        const newFilters = { ...oldFilters }
        delete newFilters[key]
        // const dirtyFilters = get().dirtyFilters
        // dirtyFilters.delete(key)
        console.log("Resetting filter:", { key, oldFilters, newFilters })

        set({
            filters: newFilters,
            dirtyFilters: get().dirtyFilters.add(key),
        })
    },

    selectOption: (key, optionToSelect) => {
        let state = get().filters[key] || {
            numerical: false,
            options: [],
        }
        if (!state.numerical) {
            const alreadySelected = state.options.find(opt => opt === optionToSelect)
            if (!alreadySelected) {
                set({
                    filters: {
                        ...get().filters,
                        [key]: {
                            ...state,
                            options: [...state.options, optionToSelect],
                        }
                    },
                    dirtyFilters: get().dirtyFilters.add(key),
                })

            }
        }
    },

    deselectOption: (key, optionToDeselect) => {
        const state = get().filters[key]
        if (state && !state.numerical) {

            // Deselect this option
            const newOptions = state.options.filter(opt => opt !== optionToDeselect)
            const filters = get().filters

            // const dirtyFilters = get().dirtyFilters
            // dirtyFilters.delete(key)

            // If there are no more options selected, delete the whole filter object
            if (newOptions.length === 0) {
                delete filters[key]
                return set({
                    filters: { ...filters },
                    dirtyFilters: get().dirtyFilters.add(key),
                })
            }

            // If there are still options selected, update the existing filter
            const filter = filters[key]
            if (!filter.numerical) {
                filter.options = newOptions
                return set({
                    filters: {
                        ...filters,
                        [key]: filter,
                    },
                    dirtyFilters: get().dirtyFilters.add(key),
                })
            }


            // }
            // set({
            //     filters: {
            //         ...get().filters,
            //         [key]: {
            //             ...state,
            //             // active: newOptions.length > 0,
            //             options: newOptions,
            //         }
            //     }
            // })
        }
    },

    setFilterMin: (key, value, defaultMin, defaultMax) => {
        const state = get().filters[key] || {
            numerical: true,
            min: defaultMin,
            max: defaultMax,
        }
        if (state.numerical) {
            set({
                filters: {
                    ...get().filters,
                    [key]: {
                        ...state,
                        // active: true,
                        min: value,
                    },
                },
                dirtyFilters: get().dirtyFilters.add(key),
            })
        }
    },


    setFilterMax: (key, value, defaultMin, defaultMax) => {
        const state = get().filters[key] || {
            numerical: true,
            min: defaultMin,
            max: defaultMax,
        }
        if (state.numerical) {
            set({
                filters: {
                    ...get().filters,
                    [key]: {
                        ...state,
                        // active: true,
                        max: value,
                    }
                },
                dirtyFilters: get().dirtyFilters.add(key),
            })
        }
    },

    /**
     * seller=
     */
    toQueryString_old: () => {
        const queryParams: string[] = []

        const filters = get().filters
        Object.entries(filters).forEach(([key, filter]) => {
            if (filter.numerical) {
                queryParams.push(`${key}=${filter.min},${filter.max}`)
            }
            else {
                queryParams.push(key + "=" + filter.options.join(","))
            }
        })

        const queryString = queryParams.join("&")
        return queryString
    },

    toQuery: () => {
        const queryParams: Record<string, string> = {}

        const filters = get().filters
        Object.entries(filters).forEach(([key, filter]) => {
            if (filter.numerical) {
                queryParams[key] = `${filter.min},${filter.max}`
            }
            else {
                queryParams[key] = filter.options.join(",")
            }
        })

        return queryParams
    },

    clearDirtyFilters: () => {
        set({ dirtyFilters: new Set() })
    },
}))

function columnIsNumerical(key: string, columnMetadata: ColumnMetadata[]): boolean {
    const colMetadata = columnMetadata.find(col => col.key === key)
    if (!colMetadata) {
        throw new Error("column not found: " + JSON.stringify({ colMetadata, key, columnMetadata }))
    }
    return colMetadata.numerical
}


type Query = Record<string, string | string[] | undefined>

export function createFiltersFromQueryString(query: Query, columnMetadata: ColumnMetadata[]): Filters {

    if (Object.keys(query).length === 0) {
        return {}
    }

    // const queryParams = queryString.split("&")
    const columnKeys = columnMetadata.map(col => col.key)

    const specialQueryFields = ["results", "page", "sort", "sel", "search"]

    const filters: Filters = {}

    Object.entries(query).forEach(([key, values]) => {
        if (specialQueryFields.includes(key)) {
            return
        }

        if (!columnKeys.includes(key)) {
            return
        }

        if (typeof values === "string" && values !== "") {
            if (columnIsNumerical(key, columnMetadata)) {
                const [min, max] = values.split(",").map(s => Number(s))
                filters[key] = {
                    numerical: true,
                    min,
                    max,
                }
            }
            else {
                filters[key] = {
                    numerical: false,
                    options: values.split(","),
                }
            }
        }
    })

    return filters
}
