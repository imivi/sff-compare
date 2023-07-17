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
    font-size: .9em;
    font-family: inherit;
    padding: .6em;
    /* border: 2px solid #0077ff; */
    border: 1px solid #ccc;
    border-radius: .3em;
    background-color: white;
    color: black;
    position: relative;
    z-index: 10;
    display: flex;

    option {
    }

    &:hover {
        opacity: .8;
    }
`