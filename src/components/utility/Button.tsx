import { type HTMLAttributes } from "react"
import { css } from "@emotion/react"


type Props = {
    isInline?: boolean
} & HTMLAttributes<HTMLButtonElement>

export default function Button(props: Props) {

    const inline = props?.isInline === true

    return (
        <button css={ style } {...props} data-inline={ inline }/>
    )

}

const style = css`
    margin: 1em auto;
    font-size: .9em;
    font-family: inherit;
    padding: .5em;
    background-color: #0077ff;
    border: none;
    border-radius: .3em;
    color: white;
    position: relative;
    z-index: 10;
    display: flex;
    cursor: pointer;

    &[data-inline=true] {
        display: inline-flex;
    }

    &:hover {
        opacity: .8;
    }
`