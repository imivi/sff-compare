import { Cube } from "@/components/Visualizer"
import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'


type Store = {
    hiddenCases: Record<string,any> // Used instead of a set because sets aren't serializable to JSON (for localstorage persist)
    toggleHideCase: (caseId: string) => void
    caseIsHidden: (caseId: string) => boolean

    customCubes: Cube[]
    addCustomCube: (cube: Cube) => void
    deleteCustomCube: (cubeId: string) => void
}



export const useVisualizerStore = create<Store>()(
    persist((set, get) => ({

        hiddenCases: {},

        toggleHideCase(caseId) {
            const { hiddenCases, caseIsHidden } = get()

            if (caseIsHidden(caseId)) {
                delete hiddenCases[caseId]
            }
            else {
                hiddenCases[caseId] = null
            }
            set({ hiddenCases: { ...hiddenCases } })
        },
        caseIsHidden(caseId: string) {
            return Object.keys(get().hiddenCases).includes(caseId)
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
