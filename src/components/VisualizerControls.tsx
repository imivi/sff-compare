import { FormEvent } from "react"
import { css } from "@emotion/react"
import { Cube } from "./Visualizer"
import { Eye, EyeOff, X } from "tabler-icons-react"
import { useVisualizerStore } from "@/store/useVisualizerStore"
import Button from "./utility/Button"
import { Vector3 } from "three"


type Props = {
    cubes: Cube[]
}

export default function VisualizerControls({ cubes }: Props) {

    const hiddenCases = useVisualizerStore(store => store.hiddenCases)
    const toggleHideCase = useVisualizerStore(store => store.toggleHideCase)
    const addCustomCube = useVisualizerStore(store => store.addCustomCube)
    const deleteCustomCube = useVisualizerStore(store => store.deleteCustomCube)

    const customCubes = useVisualizerStore(store => store.customCubes)

    function handleAddCustomCube(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)

        const data = Object.fromEntries(formData.entries())
        // console.log(data)

        try {
            // Convert from mm to cm
            const x = Number(data.x) / 10
            const y = Number(data.y) / 10
            const z = Number(data.z) / 10
            const newCube: Cube = {
                name: data.name.toString(),
                size: new Vector3(x,y,z),
                custom: true,
                // https://caniuse.com/?search=Web+Crypto
                id: window.crypto.randomUUID(),
            }
            addCustomCube(newCube)
            // console.log("Adding cube:", newCube.name, newCube.id)
        }
        catch (error) {
            console.error(error)
        }
    }
    
    return (
        <div css={ style }>
            {
                cubes.map(cube => {
                    const caseIsHidden = hiddenCases.hasOwnProperty(cube.id)
                    return (
                        <div key={ cube.id } data-hidden={ caseIsHidden }>
                            <span className="btn" onClick={ () => toggleHideCase(cube.id) }>
                                { caseIsHidden ? <EyeOff/> : <Eye/> }
                            </span>
                            <span onClick={ () => toggleHideCase(cube.id) }>
                                <span>{ cube.name } </span>
                                <small>{ [cube.size.x, cube.size.z, cube.size.y].map(n => Math.round(n)).join(" x ") } cm</small>
                            </span>
                            { 
                                cube.custom && 
                                <span className="btn" onClick={ () => deleteCustomCube(cube.id) }>
                                    <X size={ 16 } color="brown"/>
                                </span>
                            }
                        </div>
                    )
                })
            }
            <form onSubmit={ (e) => handleAddCustomCube(e) }>
                <label>
                    <span>Name</span>
                    <input type="text" name="name" required defaultValue="Custom"/>
                </label>
                <label>
                    <span>Length (mm)</span>
                    <input type="number" name="z" required/>
                </label>
                <label>
                    <span>Width (mm)</span>
                    <input type="number" name="x" required/>
                </label>
                <label>
                    <span>Height (mm)</span>
                    <input type="number" name="y" required/>
                </label>
                <Button type="submit">Add custom</Button>
            </form>
            {/* <button onClick={ () => console.log(customCubes) }>log custom cubes</button> */}
        </div>
    )

}

const style = css`
    position: absolute;
    left: 10px;
    top: 10px;
    padding: 10px;
    /* background-color: rgba(0,0,0, 0.1); */
    /* border: 1px solid #ccc; */
    color: #333;
    z-index: 1;

    max-height: 100%;
    overflow: auto;

    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .btn {
        cursor: pointer;
    }

    & > div {
        display: flex;
        place-items: center;
        gap: 5px;
        cursor: pointer;

        &[data-hidden=true] {
            opacity: 0.3;
        }

        small {
            font-size: .8em;
            border: 1px solid #ccc;
            padding: .2em;
            border-radius: .2em;
        }
    }

    form {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        padding: 10px;
        gap: 5px;

        label {
            display: grid;
            grid-template-columns: 1fr;
            grid-auto-flow: column;
            gap: 5px;
        }

        input {
            max-width: 6rem;
            font-size: inherit;
            font-family: inherit;
        }
    }
`