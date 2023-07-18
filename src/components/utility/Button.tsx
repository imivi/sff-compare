import { ReactNode, type HTMLAttributes } from "react"
import { css } from "@emotion/react"


type Props = {
    inline?: boolean
    onClick?: () => unknown
    children?: ReactNode
    disabled?: boolean
    type?: "submit" | "button"
}// & HTMLAttributes<HTMLButtonElement>

export default function Button({ inline, onClick, disabled=false, type="button", children }: Props) {

    // const inline = props?.isInline === true

    return (
        <button
            css={ style }
            onClick={ onClick }
            data-is-inline={ inline }
            disabled={ disabled }
            data-disabled={ disabled }
            type={ type }
        > { children }
        </button>
    )

}

const style = css`
    margin: 0 auto;
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

    &[data-is-inline=true] {
        display: inline-flex;
    }

    &[data-disabled=true] {
        background-color: #aaa;
        color: #555;
    }

    &:hover {
        opacity: .8;
    }
`