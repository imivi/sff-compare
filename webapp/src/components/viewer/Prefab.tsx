import { useViewerStore } from "@/store/useViewerStore";
import { Html, useCursor, useGLTF } from "@react-three/drei"
import { useLoader } from "@react-three/fiber";
import { useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Props = {
    modelUrl: string
    name: string
    defaultXPosition: number
    show: boolean
}

export function Prefab({ modelUrl, name, defaultXPosition, show }: Props) {

    const [hovered, setHovered] = useState(false)
    const selectedPrefab = useViewerStore(store => store.selectedPrefab)
    const selectPrefab = useViewerStore(store => store.selectPrefab)
    const deselectPrefab = useViewerStore(store => store.deselectPrefab)

    useCursor(hovered, "pointer")

    const gltf = useLoader(GLTFLoader, modelUrl)

    const isSelected = name === selectedPrefab

    return (
        <group
            name={name}
            onClick={(e) => { e.stopPropagation(); selectPrefab(name) }}
            onPointerMissed={deselectPrefab}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            visible={show}
        >
            <primitive position={[defaultXPosition, show ? 0 : 100, 0]} object={gltf.scene} scale={1} />
            {isSelected && <Html style={{ bottom: 10 }}>{name}</Html>}

        </group>
    )
}