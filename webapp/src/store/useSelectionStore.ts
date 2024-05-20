import { create } from "zustand"

type Store = {
    selectedCaseIds: Set<string>
    toggleSelect: (caseId: string) => void

    selectCases: (caseIds: string[]) => void
    deselectCases: (caseIds: string[]) => void

    onlyShowSelected: boolean
    setOnlyShowSelected: (value: boolean) => void
}

export const useSelectionStore = create<Store>((set, get) => ({

    selectedCaseIds: new Set([]),

    toggleSelect: (caseId) => {
        const ids = get().selectedCaseIds
        if (ids.has(caseId)) {
            ids.delete(caseId)
            if (ids.size > 0) {
                set({ selectedCaseIds: ids })
            }
            else {
                set({ selectedCaseIds: ids, onlyShowSelected: false })
            }
        }
        else {
            ids.add(caseId)
        }
        set({ selectedCaseIds: new Set(ids) })
    },

    selectCases: (ids) => {
        const selectedIds = get().selectedCaseIds
        ids.forEach(id => selectedIds.add(id))
        set({ selectedCaseIds: selectedIds })
    },

    deselectCases: (ids) => {
        const selectedIds = get().selectedCaseIds
        ids.forEach(id => selectedIds.delete(id))
        set({ selectedCaseIds: selectedIds })
    },

    onlyShowSelected: false,
    setOnlyShowSelected: (onlyShowSelected) => set({ onlyShowSelected }),
}))