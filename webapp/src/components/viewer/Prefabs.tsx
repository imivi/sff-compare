import { TransformControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber";
import { useViewerStore } from "@/store/useViewerStore";
import { useMemo } from "react";
import { type Prefab as PrefabType } from "@/types";
import { Prefab } from "./Prefab";


export const prefabs: PrefabType[] = [
    { id: "monitor-24", label: 'Monitor - 24"', url: "/models/monitor-24.glb" },
    { id: "monitor-27", label: 'Monitor - 27"', url: "/models/monitor-27.glb" },
    { id: "monitor-34", label: 'Monitor - 34" (UW)', url: "/models/monitor-34.glb" },
]

type Props = {
    hidden: string[]
}

export function Prefabs({ hidden }: Props) {

    const selectedPrefab = useViewerStore(store => store.selectedPrefab)

    return <>
        {
            selectedPrefab !== null &&
            <PrefabControls objectName={selectedPrefab} />
        }

        {
            prefabs.map((prefab, i) => (
                <Prefab
                    key={prefab.id}
                    name={prefab.label}
                    modelUrl={prefab.url}
                    defaultXPosition={i * 0.1}
                    show={!hidden.includes(prefab.id)}
                />
            ))
        }
    </>
}

type PrefabControlsProps = {
    objectName: string
}

function PrefabControls({ objectName }: PrefabControlsProps) {

    const scene = useThree(state => state.scene)

    const obj = useMemo(() => scene.getObjectByName(objectName), [scene, objectName])

    return (
        <TransformControls
            object={obj}
            showY={false}
        />
    )
}