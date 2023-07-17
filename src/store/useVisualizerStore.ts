import { create } from "zustand"

type Store = {
    hiddenCases: Set<string>
    toggleHideCase: (caseId: string) => void
}

export const useVisualizerStore = create<Store>((set,get) => ({
    
    hiddenCases: new Set(),
    
    toggleHideCase(caseId) {
        const { hiddenCases } = get()
        if(hiddenCases.has(caseId)) {
            hiddenCases.delete(caseId)
        }
        else {
            hiddenCases.add(caseId)
        }
        return set({ hiddenCases: new Set(hiddenCases) })
    },
}))