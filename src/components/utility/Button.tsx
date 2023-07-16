import { type HTMLAttributes } from "react"
import { css } from "@emotion/react"


export default function Button(props: HTMLAttributes<HTMLButtonElement>) {

    return (
        <button css={ style } {...props}/>
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

    &:hover {
        opacity: .8;
    }
`