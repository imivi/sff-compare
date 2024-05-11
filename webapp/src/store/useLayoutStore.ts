import { create } from "zustand"

type Store = {
    showSidebar: boolean
    toggleShowSidebar: () => void
    hideSidebar: () => void

    showViewer: boolean
    toggleViewer: () => void

    maximizeViewer: boolean
    toggleMaximizeViewer: () => void
}

export const useLayoutStore = create<Store>((set, get) => ({
    showSidebar: false,
    toggleShowSidebar: () => set({ showSidebar: !get().showSidebar }),
    hideSidebar: () => set({ showSidebar: false }),

    showViewer: false,
    toggleViewer: () => set({ showViewer: !get().showViewer }),

    maximizeViewer: false,
    toggleMaximizeViewer: () => set({ maximizeViewer: !get().maximizeViewer }),
}))