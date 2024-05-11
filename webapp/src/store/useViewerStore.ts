import { create } from "zustand"

type Store = {
    selectedPrefab: string | null
    selectPrefab: (id: string) => void
    deselectPrefab: () => void
}

export const useViewerStore = create<Store>((set, get) => ({

    selectedPrefab: null,

    selectPrefab: (id) => set({ selectedPrefab: id }),

    deselectPrefab: () => set({ selectedPrefab: null }),
}))