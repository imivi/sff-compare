import { css } from "@emotion/react"
import { useEffect, useState } from "react"

type Props = {
    range: [number,number]
    value: number
    tickCount?: number
    step?: number
    delayMs?: number,
    /**
     * Fires when a handle stops being dragged
     * @param the new values
     */
    onChange: (newValue: number) => unknown
    onDrag?:  (newValue: number) => unknown
}

export default function Slider({ range, value, tickCount=1, onChange, step=1, delayMs=250, onDrag }: Props) {

    // const [value, setValue] = useState(minValue)
    const [timeoutId, setTimeoutId] = useState<number|null>(null)

    const [min,max] = range

    // useEffect(() => {

    // }, [])

    function handleChange(value: number) {
        if(onDrag) {
            onDrag(value)
        }
        
        // Throttle onChange event
        if(timeoutId) {
            window.clearTimeout(timeoutId)
        }
        const newTimeoutId = window.setTimeout(() => {
            console.log(value)
            onChange(value)
        }, delayMs)
        setTimeoutId(newTimeoutId)
    }

    return (
        <div css={ style }>
            <input
                title={ value.toFixed(2) }
                type="range"
                min={ min }
                max={ max }
                step={ step }
                value={ value }
                onChange={ e => handleChange(Number(e.target.value)) }
            />
        </div>
    )
}


const style = css`

    width: 100%;
    position: absolute;
    left: 0;
    top: 0;

    input[type=range] {
        -webkit-appearance: none;
        appearance: none;
        /* height: 2px; */
        height: 0;
        width: 100%;
        background-color: #C6C6C6;
        pointer-events: none;
    }

    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        pointer-events: all;
        width: 24px;
        height: 24px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 1px #C6C6C6;
        cursor: pointer;
    }

    input[type=range]::-moz-range-thumb {
        -webkit-appearance: none;
        appearance: none;
        pointer-events: all;
        width: 14px;
        height: 14px;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0 0 1px #C6C6C6;
        cursor: pointer;
    }

    input[type=range]::-webkit-slider-thumb:hover {
        background: #f7f7f7;
    }

    input[type=range]::-webkit-slider-thumb:active {
        box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
        -webkit-box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
    }
`