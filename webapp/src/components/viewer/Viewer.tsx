import s from "./Viewer.module.scss"

import { useLayoutStore } from "@/store/useLayoutStore"
import { Environment, OrbitControls, GizmoHelper, GizmoViewport } from "@react-three/drei"
import Grid from "./Grid"
import { Canvas } from "@react-three/fiber"
import { useMemo, useRef, useState } from "react"
import Box from "./Box"
import { IconArrowsDiagonal, IconArrowsDiagonalMinimize2, IconArrowsUpDown, IconEye, IconEyeOff, IconPlus, IconRotateClockwise, IconX } from "@tabler/icons-react"
import { useSelectionStore } from "@/store/useSelectionStore"
import { useQueries } from "@tanstack/react-query"
import { api } from "@/api"
import { Row, SffCase } from "@/types"
import { z } from "zod"
import Modal from "./Modal"
import SelectedCasePanel from "./SelectedCasePanel"
import { Prefabs, prefabs } from "./Prefabs"
import { useCustomCasesStore } from "@/store/useCustomCasesStore"


const fetchedCaseSchema = z.object({
    id: z.string(),
    case: z.union([z.string(), z.number()]),
    case_length_mm: z.number(),
    case_width_mm: z.number(),
    case_height_mm: z.number(),
    volume_l: z.number(),
    footprint_cm2: z.number(),
})


const sortKeys = {
    case: "Name",
    volume: "Volume",
    footprint_cm2: "Footprint",
    case_length_mm: "Length",
    case_width_mm: "Width",
    case_height_mm: "Height",
} as const


type SortOption = keyof typeof sortKeys

export default function Viewer() {

    const show = useLayoutStore(store => store.showViewer)
    const toggleViewer = useLayoutStore(store => store.toggleViewer)

    const [showModal, setShowModal] = useState(false)

    const selectedCases = useSelectionStore(store => Array.from(store.selectedCaseIds))
    const toggleSelect = useSelectionStore(store => store.toggleSelect)
    const maximizeViewer = useLayoutStore(store => store.maximizeViewer)
    const toggleMaximizeViewer = useLayoutStore(store => store.toggleMaximizeViewer)

    const [hiddenCases, setHiddenCases] = useState<string[]>(Object.keys(prefabs)) // Hide the prefabs by defaults
    const [rotatedCases, setRotatedCases] = useState<string[]>([])
    const [selectedCase, setSelectedCase] = useState<string | null>(null)
    const [hoveredCase, setHoveredCase] = useState<string | null>(null)

    const [sortBy, setSortBy] = useState<SortOption>("case")

    function toggleShowCase(caseId: string) {
        if (hiddenCases.find(id => id === caseId)) {
            setHiddenCases(hiddenCases.filter(id => id !== caseId))
        }
        else {
            setHiddenCases([...hiddenCases, caseId])
        }
    }

    function rotateCase(caseId: string) {
        if (rotatedCases.find(id => id === caseId)) {
            setRotatedCases(rotatedCases.filter(id => id !== caseId))
        }
        else {
            setRotatedCases([...rotatedCases, caseId])
        }
    }

    const getCasesSelectedQuery = useQueries({
        queries: selectedCases.map(caseId => ({
            queryKey: ["case", caseId],
            queryFn: async () => await api.getItem(caseId),
        }))
    })

    const { customCases, addCustomCase, deleteCustomCase } = useCustomCasesStore()

    const allCases = useMemo(() => {
        const fetchedCases = parseFetchedCases(getCasesSelectedQuery.map(query => query.data), rotatedCases)
        return [...fetchedCases, ...customCases.map(c => applyCaseRotation(c, rotatedCases))].sort((a, b) => sortingFn(a, b, sortBy))

    }, [getCasesSelectedQuery, sortBy, rotatedCases, customCases])

    const visibleCases = allCases.filter(sffCase => !hiddenCases.includes(sffCase.id))

    const xOffsets = useMemo(() => getCaseXOffsets(visibleCases.map(box => box.size[0] / 1000)), [visibleCases])

    const totalCasesWidthMm = visibleCases.reduce((total, box) => total + box.size[0], 0)
    const totalCasesWidthMeters = (totalCasesWidthMm) / 1000

    function onBackgroundClicked() {
        if (hoveredCase === null) {
            setSelectedCase(null)
        }
    }

    return (
        <div className={s.container} data-show={show} data-maximized={maximizeViewer}>

            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                onCreated={(newCase) => { addCustomCase(newCase); setSelectedCase(newCase.id) }}
            />

            <div className={s.buttons_top_right}>

                <button className="g-unstyled" onClick={toggleMaximizeViewer}>
                    {maximizeViewer ? <IconArrowsDiagonalMinimize2 size={30} /> : <IconArrowsDiagonal size={30} />}
                </button>

                <button className="g-unstyled" onClick={toggleViewer}>
                    <IconX size={36} />
                </button>

            </div>

            {
                selectedCases.length === 0 &&
                <div className={s.prompt_use_checkbox}>
                    No cases selected
                </div>
            }

            {
                selectedCase &&
                <SelectedCasePanel sffCaseId={selectedCase} customCases={customCases} />
            }

            <div className={s.selected_cases_list} data-show={allCases.length > 0}>
                <ul>
                    {allCases.map(box => (
                        <li key={box.id}
                            data-visible={!hiddenCases.includes(box.id)}
                            data-highlight={box.id === selectedCase}
                        >

                            <button className="g-unstyled" onClick={() => { toggleSelect(box.id); deleteCustomCase(box.id) }}>
                                <IconX size={18} />
                            </button>

                            <label onClick={() => setSelectedCase(box.id)}>{box.label}</label>

                            <button className="g-unstyled" onClick={() => rotateCase(box.id)}>
                                <IconRotateClockwise size={18} />
                            </button>

                            <button className="g-unstyled" onClick={() => toggleShowCase(box.id)}>
                                {
                                    hiddenCases.includes(box.id)
                                        ? <IconEyeOff size={18} />
                                        : <IconEye size={18} />
                                }
                            </button>
                        </li>
                    ))}
                    {Object.keys(prefabs).map(name => (
                        <li key={name}
                            data-visible={!hiddenCases.includes(name)}
                            data-highlight={name === selectedCase}
                        >

                            <label onClick={() => setSelectedCase(name)}>{name}</label>

                            <button className="g-unstyled" onClick={() => toggleShowCase(name)}>
                                {
                                    hiddenCases.includes(name)
                                        ? <IconEyeOff size={18} />
                                        : <IconEye size={18} />
                                }
                            </button>
                        </li>
                    ))}
                </ul>

                <footer>

                    <button className={s.btn_add_custom} onClick={() => setShowModal(true)}>
                        <IconPlus size={18} /> Custom
                    </button>

                    <label>
                        <IconArrowsUpDown size={18} />
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                            {
                                Object.keys(sortKeys).map(opt => (
                                    <option key={opt} value={opt}>{sortKeys[opt as SortOption]}</option>
                                ))
                            }
                        </select>
                    </label>
                </footer>


            </div>

            <Canvas
                shadows
                frameloop="demand"
                camera={{ position: [0, 1, 1], fov: 25 }}
                onClick={onBackgroundClicked}
            >

                <Grid sizeX={1} sizeZ={1} />

                <group position={[-totalCasesWidthMeters / 2, 0, 0]}>
                    {
                        visibleCases.map((box, i) => {
                            return (
                                <Box
                                    key={i}
                                    posXY={[xOffsets[i], 0]}
                                    sizeMM={box.size}
                                    label={box.label}
                                    highlight={selectedCase === box.id || hoveredCase === box.id}
                                    onClick={() => setSelectedCase(box.id)}
                                    onHover={() => setHoveredCase(box.id)}
                                    onPointerOut={() => setHoveredCase(null)}
                                />
                            )
                        })
                    }
                </group>

                <Prefabs hidden={hiddenCases} />

                <OrbitControls makeDefault />

                <ambientLight intensity={Math.PI / 4} />
                <spotLight position={[10, 20, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />

                <Environment preset="city" />
                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
                </GizmoHelper>

            </Canvas>

        </div>
    )
}



function getCaseXOffsets(xSizes: number[]) {
    const xOffsets: number[] = []
    const gapSize = 0.01
    let xPos = 0
    xSizes.forEach(xSize => {
        xOffsets.push(xPos)
        xPos = xPos + xSize + gapSize
    })
    return xOffsets
}

function parseFetchedCases(sffCases: (Row | undefined)[], rotatedCases: string[]): SffCase[] {
    const cases: SffCase[] = []
    for (const sffCase of sffCases) {
        if (sffCase) {
            const validationResult = fetchedCaseSchema.safeParse(sffCase)
            if (validationResult.success) {
                const { id, case: name, case_height_mm, case_width_mm, case_length_mm, volume_l, footprint_cm2 } = validationResult.data

                let size: [number, number, number] = [case_width_mm, case_height_mm, case_length_mm]

                if (rotatedCases.includes(id)) {
                    size = [case_length_mm, case_height_mm, case_width_mm]
                }
                cases.push({
                    id,
                    label: name.toString(),
                    size,
                    volume: volume_l,
                    footprint: footprint_cm2,
                })
            }
            else {
                console.log(validationResult.error)
            }
        }
    }
    return cases
}


function sortingFn(a: SffCase, b: SffCase, sortKey: SortOption): number {
    if (sortKey === "case") {
        return a.label < b.label ? -1 : 1
    }
    else if (sortKey === "volume") {
        return a.volume < b.volume ? -1 : 1
    }
    else if (sortKey === "footprint_cm2") {
        return a.footprint < b.footprint ? -1 : 1
    }
    else if (sortKey === "case_width_mm") {
        return a.size[0] < b.size[0] ? -1 : 1
    }
    else if (sortKey === "case_height_mm") {
        return a.size[1] < b.size[1] ? -1 : 1
    }
    else if (sortKey === "case_length_mm") {
        return a.size[2] < b.size[2] ? -1 : 1
    }
    return 0
}


function applyCaseRotation(sffCase: SffCase, rotatedCases: string[]): SffCase {
    if (!rotatedCases.includes(sffCase.id)) {
        return sffCase
    }
    const [length, height, width] = sffCase.size
    return {
        ...sffCase,
        size: [width, height, length],
    }
}