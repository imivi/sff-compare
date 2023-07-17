import { Row } from "@/data"
import { css } from "@emotion/react"
import { Grid, OrbitControls, Text } from "@react-three/drei"
import { Canvas, flushGlobalEffects } from "@react-three/fiber"
import { useState } from "react"
import * as THREE from "three"
import { degToRad } from "three/src/math/MathUtils"
import VisualizerControls from "./VisualizerControls"


const ZERO = Object.freeze(new THREE.Vector3(0,0,0))


export type Cube = {
    id: string
    name: string
    seller: string
    size: THREE.Vector3 // in centimeters
}


function last<T>(array: T[]) {
    return array.slice(-1)[0]
}

/**
 * Arrange cubes along a single axis.
 * @param cubes 
 */
function getCubePositions(cubes: Cube[], spacing: number) {

    if(cubes.length === 0) {
        return []
    }
    
    const positions = []
    let currentPosition = -cubes[0].size.x
    for(const cube of cubes) {
        currentPosition = currentPosition + cube.size.x + spacing
        positions.push(currentPosition)
    }

    return positions
}


const validPages = new Set(["cases1", "cases2", "cases3"])


type Props = {
    rows?: Row[]
}

export default function Visualizer({ rows }: Props) {

    const [fullscreen, setFullscreen] = useState(false)
    const [hiddenCases, setHiddenCases] = useState(new Set<string>([]))


    if(!rows || rows.length === 0) {
        return <div>Nothing selected</div>
    }

    const caseMaterial = new THREE.MeshLambertMaterial()

    const selectedCubes: Cube[] = rows
        .filter(row => validPages.has(row.page))
        .map(row => ({
            id: row.id,
            name: row?.Case?.toString() || "?",
            seller: row?.Seller?.toString() || "?",
            size: new THREE.Vector3(
                Number(row["Case Width (mm)"])  / 10, // Convert mm to cm
                Number(row["Case Height (mm)"]) / 10, // Convert mm to cm
                Number(row["Case Length (mm)"]) / 10, // Convert mm to cm
            ),
        }))

    const cubesToRender = selectedCubes.filter(cube => !hiddenCases.has(cube.id))


    // console.log(rows, cubesToRender)

    // const gridSize = 100


    const spacing = 1
    const cubePositions = getCubePositions(cubesToRender, spacing)

    // Center the positions around the middle element
    const offset = last(cubePositions)/2

    // Calculate bounding box for all the cases rendered
    const margin = 10
    const maxLength  = margin + Math.max(...cubesToRender.map(cube => cube.size.z))
    const casesWidth = margin + spacing * (cubesToRender.length-1) + cubesToRender.reduce((sum,cube) => sum+=cube.size.x, 0)


    // const tableMin = Math.min(...cubePositions)
    // const tableMax = Math.max(...cubePositions)

    // console.info(cubesToRender)

    function hideOrUnhideCase(caseId: string) {
        if(hiddenCases.has(caseId)) {
            hiddenCases.delete(caseId)
            setHiddenCases(new Set(hiddenCases))
        }
        else {
            hiddenCases.add(caseId)
            setHiddenCases(new Set(hiddenCases))
        }
    }

    return (
        <div css={ style } data-fullscreen={ fullscreen }>

            <VisualizerControls cubes={ selectedCubes } onToggleHideCase={ hideOrUnhideCase } hiddenCubes={ hiddenCases }/>

            {/* <button onClick={ () => setFullscreen(!fullscreen) }>fullscreen</button> */}
            <Canvas>
                <OrbitControls/>
                <ambientLight intensity={ 0.1 }/>
                <directionalLight position={ new THREE.Vector3(-40,30,60) } intensity={ 0.5 } />
                <directionalLight position={ new THREE.Vector3(40,30,60) } intensity={ 0.5 } />
                {/* <Grid sectionSize={ 10 }/> */}
                
                {/* <gridHelper args={ [gridSize, gridSize, "#aaa", "#ddd"] } position={ [0,0,0] }/> */}

                {/* Ground plane */}
                <Cube
                    // geometry={ new THREE.PlaneGeometry(100,10) }
                    size={ new THREE.Vector3(casesWidth, 0, maxLength) }
                    position={ new THREE.Vector3(0, -1, maxLength/2) }
                    material={ caseMaterial }
                />

                <group position={ new THREE.Vector3(-offset, 0, 0) }>
                    
                    {/* <Cube
                        material={ caseMaterial }
                        size={ new THREE.Vector3(1,1,1) }
                        position={ new THREE.Vector3(0,0.5,0) }
                    /> */}
                    {
                        cubesToRender.map((cube,i) => (
                            <group key={ i } position={ new THREE.Vector3(cubePositions[i], cube.size.y/2, cube.size.z/2) }>
                                <mesh
                                    material={ caseMaterial }
                                    geometry={ new THREE.BoxGeometry(cube.size.x, cube.size.y, cube.size.z) }
                                />
                                <Text
                                    fontSize={ 5 }
                                    rotation={ new THREE.Euler(degToRad(-90), 0, degToRad(90)) }
                                    color="black"
                                    anchorX="center"
                                    anchorY="middle"
                                    position={ new THREE.Vector3(0, -cube.size.y/2, maxLength) }
                                > { cube.seller } { cube.name }
                                </Text>
                            </group>
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

    button {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 1;
    }
`

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