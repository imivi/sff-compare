import { css } from "@emotion/react"
import { useState } from "react"
import Slider from "./Slider"

// function sort(nums: [number,number]) {
//     return nums.sort()
// }

type Props = {
    range: [number,number]
    values?: [number, number]
    tickCount?: number
    step?: number
    delayMs?: number,
    /**
     * Fires when a handle stops being dragged
     * @param the new values
     */
    onChange?: (newValues: [number,number]) => unknown
    onDrag?:  (newValues: [number,number]) => unknown
}

function sort(a: number, b: number): [number,number] {
    if(a > b) {
        b = a
    }
    if(b < a) {
        a = b
    }
    return [a,b]
}

export default function DualSlider({ range, values, tickCount=1, onChange, step=1, delayMs=500, onDrag }: Props) {

    // These values are only used if the component is not controlled ("values" prop is undefined)
    const [localValues, setLocalValues] = useState<[number,number]>([...range])


    function handleChange(a: number, b: number) {
        if(onChange) {
            onChange(sort(a,b))
        }
        if(localValues) {
            setLocalValues([a,b])
        }
    }

    function handleDrag(a: number, b: number) {
        if(onDrag) {
            onDrag(sort(a,b))
        }
        if(localValues) {
            setLocalValues([a,b])
        }
    }

    function getValues() {
        if(values) {
            return values
        }
        return localValues
    }

    return (
        <div css={ style }>
            {/* <small>{ values.join(", ") }</small> */}
            <Slider
                onChange={ value => handleChange(value, getValues()[1]) }
                value={ getValues()[0] }
                range={ range }
                step={ step }
                delayMs={ delayMs }
                tickCount={ tickCount }
                // onDrag={ (value) => setValues([value, values[1]]) }
                // onDrag={ value => { if(onDrag) onDrag([value,values[1]]) } }
                onDrag={ value => handleDrag(value,getValues()[1]) }
            />
            <Slider
                onChange={ value => handleChange(getValues()[0], value) }
                value={ getValues()[1] }
                range={ range }
                step={ step }
                delayMs={ delayMs }
                tickCount={ tickCount }
                // onDrag={ (value) => setValues([values[0], value]) }
                // onDrag={ value => { if(onDrag) onDrag([values[0],value]) } }
                onDrag={ value => handleDrag(getValues()[0],value) }
            />
            <div className="track" style={{ background: `linear-gradient: (transparent})` }}/>
        </div>
    )
}


const style = css`
    position: relative;
    border-bottom: 2px solid #ddd;
    margin: 10px 0;
`