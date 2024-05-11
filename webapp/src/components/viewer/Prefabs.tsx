import { TransformControls, useGLTF } from "@react-three/drei"
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Prefab } from "./Prefab";
import { useViewerStore } from "@/store/useViewerStore";
import { useMemo } from "react";


export const prefabs: Record<string, string> = {
    "monitor-24": "/models/monitor-24.glb",
    "monitor-27": "/models/monitor-27.glb",
    "monitor-34": "/models/monitor-34.glb",
}

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
            Object.keys(prefabs).map((name, i) => (
                <Prefab
                    key={name}
                    name={name}
                    modelUrl={prefabs[name]}
                    defaultXPosition={i * 0.1}
                    show={!hidden.includes(name)}
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