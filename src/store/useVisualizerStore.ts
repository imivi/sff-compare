import { Cube } from "@/components/Visualizer"
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'


type Store = {
    hiddenCases: Set<string>
    toggleHideCase: (caseId: string) => void

    customCubes: Cube[]
    addCustomCube: (cube: Cube) => void
    deleteCustomCube: (cubeId: string) => void
}



export const useVisualizerStore = create<Store>()(
    persist((set, get) => ({

        hiddenCases: new Set(),

        toggleHideCase(caseId) {
            const { hiddenCases } = get()
            if (hiddenCases.has(caseId)) {
                hiddenCases.delete(caseId)
            }
            else {
                hiddenCases.add(caseId)
            }
            set({ hiddenCases: new Set(hiddenCases) })
        },

        customCubes: [],
        addCustomCube(newCube) {
            const customCubes = get().customCubes
            if (!customCubes.some(cube => cube.id === newCube.id)) {
                set({ customCubes: [...customCubes, newCube] })
            }
            else {
                console.error("New cube id already exists:", newCube.id)
            }
        },
        deleteCustomCube(cubeId: string) {
            const { customCubes } = get()
            set({
                customCubes: [...customCubes.filter(cube => cube.id !== cubeId)]
            })
        },
    }),
        {
            name: 'sff-compare-store', // unique name
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
)
