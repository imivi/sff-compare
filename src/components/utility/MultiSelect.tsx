import { css } from "@emotion/react"
import { useEffect, useMemo, useRef, useState, MouseEvent } from "react"
import { Selector, X } from "tabler-icons-react"

export type SelectOption = {
    label: string
    value: string|number
}


type Props = {
    className: string
    closeMenuOnSelect: boolean
    options: SelectOption[]
    values: SelectOption[]
    onChange: (selectedOptions: SelectOption[]) => unknown
}

export default function MultiSelect({ className, closeMenuOnSelect, options, values, onChange }: Props) {

    const [open, setOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // const optionsSet = useMemo(() => new Set(options), [options])
    const valuesSet = new Set(values.map(value => value.value))

    const unselectedOptions = options.filter(option => !valuesSet.has(option.value))

    function handleSelect(option: SelectOption) {
        console.info("Selected:", option)
        onChange([ ...values, option ])
        if(closeMenuOnSelect) {
            setOpen(false)
        }
    }

    function handleRemove(optionToRemove: SelectOption) {
        onChange(values.filter(option => option.value !== optionToRemove.value))
    }

    // Add event listeners to close the menu when the user clicks outside it
    useEffect(() => {
        ["click", "touchstart"].forEach((type) => {
            document.addEventListener(type, (evt: Event) => {
                // @ts-expect-error "EventTarget != Node"
                if (menuRef?.current && menuRef.current.contains(evt.target)) {
                    return
                }
                setOpen(false)
            })
        })
    }, [])
    
    return (
        <div css={ style } className="select-header" data-open={ open } ref={ menuRef }>
            {
                values.length === 0 &&
                <span
                    onClick={ () => unselectedOptions.length>0 && setOpen(!open) }
                    className="pointer">
                    Select...
                </span>
                // <input
                //     type="text"
                //     className="pointer"
                //     onClick={ () => unselectedOptions.length>0 && setOpen(!open) }
                //     value="Select..."
                //     readOnly
                //     // onBlur={ () => setOpen(false) }
                //     onFocus={ () => setOpen(true) }
                // />
            }
            {
                values.length > 0 &&
                <ul className="selected-options">
                    { values.map(option => (
                        <li key={ option.value }>
                            <span className="label" onClick={ () => handleRemove(option) }>{ option.label } </span>
                            <span>
                                <X size={ 14 } className="x pointer"/>
                            </span>
                        </li>
                    )) }
                </ul>
            }

            {
                values.length > 0 &&
                <div className="pointer" onClick={ () => onChange([]) }>
                    <X size={ 16 } className="x center"/>
                </div>
            }
            <div className="v pointer center" onClick={ () => unselectedOptions.length>0 && setOpen(!open) }>
                <Selector size={ 16 }/>
            </div>

            <ul className="select-options pointer" data-open={ open }>
            {
                unselectedOptions.map(option => (
                    <li key={ option.value } onClick={ () => handleSelect(option) }>{ option.label }</li>
                ))
            }
            </ul>
        </div>
    )
}

const style = css`

    max-width: 15em;
    position: relative;

    &[data-open=true] {
        z-index: 1;
    }

    ul {
        list-style: none;
        padding-left: 0;
        margin: 0;

        li {
            color: black;
        }
    }

    border: 1px solid #ccc;
    min-height: 1.5em;
    padding: .5em;
    padding-right: 0;
    display: grid;
    grid-template-columns: 1fr auto auto;
    justify-content: space-between;
    position: relative;
    background-color: white;
    color: #aaa;

    input {
        border: none;
        width: 100%;
        appearance: none;
    }

    ul.selected-options {
        display: flex;
        flex-wrap: wrap;
        gap: 3px;

        li {
            background-color: #e4e4e4;
            border-radius: .2em;
            padding: .2em .4em;
            display: flex;
            cursor: pointer;

            span.label {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                max-width: 6em;
            }

            &:hover {
                background-color: #edd4cb;
            }
        }
    }

    .pointer {
        cursor: pointer;
    }

    .center {
        display: flex;
        place-content: center;
        place-items: center;
        height: 100%;
    }

    .x {
        margin-bottom: -2px;
    }

    .v {
        border-left: 1px solid #ddd;
        padding: 0 5px;
        margin-left: 5px;
    }
    
    ul.select-options {
        position: absolute;
        top: 100%;
        left: 0;
        border: 1px solid #c6dbf2;

        max-height: 10em;
        overflow-y: auto;
        overflow-x: hidden;
        display: unset;
        width: 100%;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;

        &[data-open=false] {
            height: 0;
            display: none;
        }

        li {
            padding: .3em .5em;
            transition: background-color 50ms;
            background-color: white;

            &:hover {
                background-color: #c6dbf2;
                transition: inherit;
            }
        }
    }

`