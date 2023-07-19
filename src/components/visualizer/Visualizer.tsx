import { Row } from "@/data"
import { css } from "@emotion/react"
import { Line, OrbitControls, Text } from "@react-three/drei"
import { Canvas, RootState, useLoader } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import * as THREE from "three"
import { degToRad } from "three/src/math/MathUtils"
import VisualizerControls from "./VisualizerControls"
import { useVisualizerStore } from "@/store/useVisualizerStore"
import CubeWithLabel from "./CubeWithLabel"


const ZERO = Object.freeze(new THREE.Vector3(0,0,0))


export type Cube = {
    id: string
    name: string
    size: THREE.Vector3 // in centimeters
    custom: boolean
}


function last<T>(array: T[]) {
    return array.slice(-1)[0]
}

/**
 * Arrange cubes along a single axis with a certain space between them.
 * Returns the positions along that axis.
 * @param cubes 
 */
function getCubePositions(cubes: Cube[], spacing: number): number[] {

    if(cubes.length === 0) {
        return []
    }

    if(cubes.length === 1) {
        return [0]
    }
    
    const positions = [0]
    let currentPosition = 0
    for(let i=1; i<cubes.length; i++) {
        currentPosition += cubes[i-1].size.x + spacing
        positions.push(currentPosition)
    }
    
    // console.log(cubes.map(cube => cube.size.x), positions)
    // console.log({ cubes, positions })
    return positions
}


export const validPages = new Set(["cases1", "cases2", "cases3", "gpu1", "gpu2"])

function rowType(row: Row) {
    switch (row.page) {
        case "cases1":
        case "cases2":
        case "cases3":
            return "case"
        case "gpu1":
        case "gpu2":
            return "gpu"
    }
    return null
}


const caseSizeKeys = [
    "Case Width (mm)",
    "Case Height (mm)",
    "Case Length (mm)",
]

const gpuSizeKeys = [
    "Height / Thickness (mm)",
    "Width (mm)",
    "Length (mm)",
]

function rowIsValid(row: Row) {

    const type = rowType(row)
    if(type !== "case" && type !== "gpu") {
        return false
    }

    // Make sure all size columns have numbers rather than strings
    const sizeKeys = type === "case" ? caseSizeKeys : gpuSizeKeys
    const sizes = sizeKeys.filter(key => typeof row[key] === "number")


    if(sizes.length < 3) {
        return false
    }
    
    return true
}




function rowToCube(row: Row) {

    const type = rowType(row)

    // Convert case row to cube
    if(type === "case") {
        const name = [row["Seller"].toString(), row["Case"].toString()].join(" ").trim()
        const size = new THREE.Vector3(
            ...caseSizeKeys.map(key => Number(row[key]) / 10) // Convert mm to cm
        )
        return {
            id: row.id,
            name,
            size,
            custom: false,
        }
    }

    // Convert GPU row to cube
    else {
        const name = ["Brand", "Model", "Name"].map(key => row[key].toString()).join(" ")
        const size = new THREE.Vector3(
            ...gpuSizeKeys.map(key => Number(row[key]) / 10) // Convert mm to cm
        )
        return {
            id: row.id,
            name,
            size,
            custom: false,
        }
    }
}



type Props = {
    rows: Row[]
}

export default function Visualizer({ rows }: Props) {

    const [fullscreen, setFullscreen] = useState(false)

    const hiddenCases = useVisualizerStore(store => store.hiddenCases)
    const caseIsHidden = useVisualizerStore(store => store.caseIsHidden)
    const customCubes = useVisualizerStore(store => store.customCubes)

    const [caseTexture, setCaseTexture] = useState<THREE.Texture|null>(null)


    const caseMaterial = new THREE.MeshBasicMaterial({
        color: "#999",
    })

    if(caseTexture) {
        caseMaterial.map = caseTexture
    }

    useEffect(() => {
        const caseTexture = new THREE.TextureLoader().load("/textures/mesh_w.jpg")
        setCaseTexture(caseTexture)
    }, [])

    const selectedCubes: Cube[] = rows
        .filter(row => rowIsValid(row))
        .map(row => rowToCube(row))

    // console.log({ rows, selectedCubes })
    
    // Add the user-defined cubes
    selectedCubes.push(...customCubes)

    let cubesToRender: Cube[] = []
    try {
        cubesToRender = selectedCubes.filter(cube => !caseIsHidden(cube.id))
    }
    catch (error) {
        console.error({ hiddenCases })
    }


    const spacing = 1
    const cubePositions = getCubePositions(cubesToRender, spacing)


    // Calculate bounding box for all the cases rendered
    const maxLength  = Math.max(...cubesToRender.map(cube => cube.size.z))
    const casesWidth = cubesToRender.map(cube => cube.size.x).reduce((sum,n) => sum+n, 0) + spacing * (cubesToRender.length-1)
    const offset = casesWidth/2


    // Set the camera position when the scene loads
    function onLoadScene(state: RootState) {
        state.camera.position.set(0, 100, 60)
    }

    const margin = 5
    const charWidth = 3

    return (
        <div css={ style } data-fullscreen={ fullscreen }>

            <VisualizerControls cubes={ selectedCubes }/>

            {/* <button onClick={ () => setFullscreen(!fullscreen) }>fullscreen</button> */}
            <Canvas frameloop="demand" onCreated={ onLoadScene }>
                <Suspense fallback={ null }>
                    {/* <PerspectiveCamera makeDefault fov={ 40 } position={ new THREE.Vector3(0, 100, 60) }/> */}
                    <OrbitControls/>

                    <directionalLight position={ new THREE.Vector3(0, 100, 100) } intensity={ 0.7 }/>
                    <ambientLight intensity={ 0.3 }/>
                    {/* <hemisphereLight intensity={ 0.7 }/> */}

                    {/* <directionalLight position={ new THREE.Vector3(-casesWidth, 30, maxLength/2) } intensity={ 0.7 }/> */}
                    {/* <directionalLight position={ new THREE.Vector3(casesWidth, 30, maxLength/2) } intensity={ 0.7 }/> */}
                    {/* <Grid sectionSize={ 10 }/> */}
                    
                    {/* <gridHelper args={ [gridSize, gridSize, "#aaa", "#ddd"] } position={ [0,0,0] }/> */}

                    {/* Ground plane */}
                    {/* <Cube
                        // geometry={ new THREE.PlaneGeometry(100,10) }
                        size={ new THREE.Vector3(casesWidth, 0, maxLength) }
                        position={ new THREE.Vector3(0, -1, maxLength/2) }
                        material={ caseMaterial }
                    /> */}

                    {
                        selectedCubes.length === 0 &&
                        <Text
                            fontSize={ 8 }
                            // rotation={ new THREE.Euler(degToRad(-90), 0, degToRad(90)) }
                            color="black"
                            anchorX="center"
                            anchorY="middle"
                            // position={ new THREE.Vector3(0, -cube.size.y/2, cube.size.z) }
                        >No items selected
                        </Text>
                    }

                    <group position={ new THREE.Vector3(-offset, 0, 0) }>
                        {
                            cubesToRender.map((cube,i) => (
                                <CubeWithLabel
                                    key={ i }
                                    cube={ cube }
                                    cubePosition={ cubePositions[i] }
                                    material={ caseMaterial }
                                    maxLength={ maxLength }
                                />
                            ))
                        }
                    </group>
                </Suspense>
            </Canvas>
        </div>
    )
}

const style = css`
    background-color: #f4f4f4;
    width: 100%;
    height: 100%;
    position: relative;
    /* outline: 1px solid #ccc; */
    /* width: calc(100% - 1em);
    height: calc(100% - 2em);
    margin-top: 1em; */

    &[data-fullscreen=true] {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    /* button {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 1;
    } */
`

/*
type CubeProps = {
    size: THREE.Vector3
    position?: THREE.Vector3
    material: THREE.Material
}

function Cube({ size, position=ZERO, material }: CubeProps) {
    return (
        <mesh
            geometry={ new THREE.BoxGeometry(size.x, size.y, size.z) }
            material={ material }
            position={ [position.x, position.y, position.z] }
        />
    )
}
*/