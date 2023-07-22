import { Line, Text } from "@react-three/drei"
import * as THREE from "three"
import { degToRad } from "three/src/math/MathUtils"
import { Cube } from "./Visualizer"



type Props = {
    cube: Cube
    cubePosition: number
    material: THREE.Material
    maxLength: number
}

export default function CubeWithLabel({ cube, cubePosition, material, maxLength }: Props) {


    const margin = 5
    const charWidth = 3

    return (
        <group position={ new THREE.Vector3(cube.size.x/2 + cubePosition, cube.size.y/2, cube.size.z/2) }>
            <mesh
                material={ material }
                geometry={ new THREE.BoxGeometry(cube.size.x, cube.size.y, cube.size.z) }
            />
            <Text
                fontSize={ 5 }
                rotation={ new THREE.Euler(degToRad(-90), 0, degToRad(90)) }
                color="black"
                anchorX="right"
                anchorY="bottom"
                position={ new THREE.Vector3(cube.size.x/2, -cube.size.y/2, maxLength - cube.size.z/2 + margin) }
            > { cube.name }
            </Text>
            <Line
                points={[
                    new THREE.Vector3(cube.size.x/2, -cube.size.y/2, 0),
                    new THREE.Vector3(cube.size.x/2, -cube.size.y/2, maxLength - cube.size.z/2 + margin + cube.name.length*charWidth),
                ]}
                color="#bbb"
            />
        </group>
    )
}
