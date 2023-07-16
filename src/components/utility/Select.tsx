import { type HTMLAttributes, type ChangeEvent } from "react"
import { css } from "@emotion/react"


// The stock select attributes for <select> include an onChange event
// of type "FormEvent" instead of "ChangeEvent". This fixes that.
type Props = {
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => unknown
} & Omit<HTMLAttributes<HTMLSelectElement>,"onChange">

export default function Select(props: Props) {

    return (
        <select css={ style } {...props} onChange={ props?.onChange }/>
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