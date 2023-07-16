import { useState, type HTMLAttributes } from "react"
import { css } from "@emotion/react"


type Props = {
    checked: boolean
    onChange: (checked: boolean) => unknown
}

export default function Checkbox({ checked, onChange }: Props) {

    // const [checked, setChecked] = useState(true)

    return (
        <input
            type="checkbox"
            css={ style }
            data-checked={ checked }
            checked={ checked }
            onChange={ (e) => onChange(e.target.checked) }
        />
    )

}

const style = css`
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 1.2em;
    height: 1.2em;
    margin: 0 auto;
    font-size: .9em;
    font-family: inherit;
    background-color: #c6dbf2;
    border-radius: .3em;
    color: white;
    z-index: 10;
    display: flex;
    cursor: pointer;
    position: relative;

    &[data-checked=true] {
        background-color: #0077ff;

        &::after {
            content: "✓";
            width: 100%;
            height: 100%;
            position: absolute;
            font-weight: bold;
            top: 0;
            left: 0;
            display: flex;
            place-content: center;
            place-items: center;
        }
    }

    &:hover {
        opacity: .8;
        border: 1px solid dodgerblue;
    }
`