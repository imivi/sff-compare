import { ReactNode, type HTMLAttributes } from "react"
import { css } from "@emotion/react"
import { Cube } from "./Visualizer"
import { Eye, EyeCheck, EyeOff } from "tabler-icons-react"


type Props = {
    cubes: Cube[]
    onToggleHideCase: (cubeId: string) => unknown
    hiddenCubes: Set<string>
}

export default function VisualizerControls({ cubes, onToggleHideCase, hiddenCubes }: Props) {

    return (
        <div css={ style }>{
            cubes.map(cube => {
                const caseIsHidden = hiddenCubes.has(cube.id)
                return (
                    <div key={ cube.id } data-hidden={ caseIsHidden } onClick={ () => onToggleHideCase(cube.id) }>
                        <span className="btn-hide-unhide">
                            { caseIsHidden ? <EyeOff/> : <Eye/> }
                        </span>
                        <span>{ cube.seller } { cube.name } </span>
                        <small>{ [cube.size.x, cube.size.z, cube.size.y].map(n => Math.round(n)).join(" x ") }</small>
                    </div>
                )
            })
        }</div>
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

    display: flex;
    flex-direction: column;
    align-items: flex-start;

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
`