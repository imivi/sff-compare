import { Row } from "@/data"
import { css } from "@emotion/react"
import { Grid, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"


type Props = {
    rows?: Row[]
}

export default function Visualizer({ rows }: Props) {

    if(!rows || rows.length === 0) {
        return <div>Nothing selected</div>
    }

    const caseMaterial = new THREE.MeshNormalMaterial()

    const cubesToRender = rows
        .filter(row => row.page in ["cases1", "cases2", "cases3"])
        .map(row => ({
            id: row.id,
            case: row.case.toString(),
            seller: row.seller.toString(),
            size: new THREE.Vector3(
                Number(row["Case Length (mm)"]),
                Number(row["Case Height (mm)"]),
                Number(row["Case Width (mm)"]),
            ),
        }))

    return (
        <div css={ style }>
            <Canvas>
                <OrbitControls/>
                <Grid sectionSize={ 10 }/>
                <group>
                    <Cube material={ caseMaterial } size={ new THREE.Vector3(1,1,1) } position={ new THREE.Vector3(1,1,1) }/>
                    {
                        cubesToRender.map((cube,i) => (
                            <Cube
                                material={ caseMaterial }
                                size={ cube.size }
                                position={ new THREE.Vector3(1,1,1).multiplyScalar(i*2) }
                                key={ i }
                            />
                        ))
                    }
                </group>
            </Canvas>
        </div>
    )
}

const style = css`
    background-color: #f4f4f4;
    width: 100%;
    height: 100%;
    /* outline: 1px solid #ccc; */
    /* width: calc(100% - 1em);
    height: calc(100% - 2em);
    margin-top: 1em; */
`

type CubeProps = {
    size: THREE.Vector3
    position: THREE.Vector3
    material: THREE.Material
}

function Cube({ size, position, material }: CubeProps) {
    return (
        <mesh
            geometry={ new THREE.BoxGeometry(size.x, size.y, size.z) }
            material={ material }
            position={ [position.x, position.y, position.z] }
        />
    )
}