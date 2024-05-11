import { useState } from "react"
import s from "./Box.module.scss"
import { Html, useCursor } from "@react-three/drei"

type Num2D = [number, number]
type Num3D = [number, number, number]

type Props = {
    posXY: Num2D
    sizeMM: Num3D
    label: string
    onClick: () => void
    onPointerOut: () => void
    onHover: () => void
    highlight: boolean
}

export default function Box({ posXY, sizeMM, label, highlight, onClick, onPointerOut, onHover }: Props) {

    const size: Num3D = [sizeMM[0] / 1000, sizeMM[1] / 1000, sizeMM[2] / 1000]

    const position: Num3D = [
        posXY[0] + size[0] / 2,
        size[1] / 2,
        posXY[1] + size[2] / 2,
    ]

    const [hovered, setHovered] = useState(false)

    useCursor(hovered, "pointer")

    return (
        <group
            position={position}
            onPointerOver={(e) => { e.stopPropagation(); onHover(); setHovered(true) }}
            onPointerOut={(e) => { e.stopPropagation(); onPointerOut(); setHovered(false) }}
            onClick={(e) => { e.stopPropagation(); onClick() }}
        >
            <mesh>
                <boxGeometry args={size} />
                <meshStandardMaterial color={highlight ? "coral" : "white"} />
            </mesh>
            <Html className={s.box_label} zIndexRange={[1, 2]} center>{label}</Html>
        </group>
    )
}