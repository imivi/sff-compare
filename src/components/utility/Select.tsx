import { css } from "@emotion/react"


// The stock select attributes for <select> include an onChange event
// of type "FormEvent" instead of "ChangeEvent". This fixes that.
type Props = {
    // value: string|null,
    onChange?: (e: string) => unknown
    options: [string,string][] // [value, label]
    value: string | number
}// & Omit<HTMLAttributes<HTMLSelectElement>,"onChange">

export default function Select({ options, onChange, value }: Props) {

    // console.log({ options, value })

    return (<>
        {/* <div title={ JSON.stringify(options,null,4) }>Value: { value }</div> */}
        <select
            css={ style }
            onChange={ (e) => onChange && onChange(e.target.value) }
            value={ value }
        >   {
                options.map(([value,label]) => (
                    <option value={ value } key={ value }>
                        { label }
                    </option>
                ))
            }
        </select>
    </>)
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