import { Grid as GridHelper } from "@react-three/drei"

type Props = {
    sizeX: number
    sizeZ: number
}

export default function Grid({ sizeX, sizeZ }: Props) {
    return (
        <GridHelper
            position={[0, 0, 0]}
            args={[sizeX, sizeZ]}
            cellSize={0.1} // 10cm (100mm)
            cellThickness={1}
            cellColor='#6f6f6f'
            sectionSize={1}
            sectionThickness={1}
            sectionColor='coral'
            fadeDistance={10}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
        />
    )
}