import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'
import { SffCase } from "@/types";


type Store = {
    customCases: SffCase[]
    addCustomCase: (newCase: SffCase) => void
    deleteCustomCase: (caseId: string) => void
}

export const useCustomCasesStore = create(
    persist<Store>(
        (set, get) => ({
            customCases: [],
            addCustomCase: (newCase) => set({ customCases: [...get().customCases, newCase] }),
            deleteCustomCase: (caseId) => set({ customCases: get().customCases.filter(sffCase => sffCase.id !== caseId) })
        }),
        {
            name: 'custom-cases',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
