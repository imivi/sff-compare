import { create } from "zustand"

type Store = {
    searchEnabled: boolean
    setSearchEnabled: (enabled: boolean) => void
}

export const useSearchStore = create<Store>((set, get) => ({
    searchEnabled: false,
    setSearchEnabled: (enabled) => set({ searchEnabled: enabled }),
}))