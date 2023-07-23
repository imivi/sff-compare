import { css } from "@emotion/react"
import { useEffect, useState } from "react"
import Slider from "./Slider"

// function sort(nums: [number,number]) {
//     return nums.sort()
// }

type Props = {
    // range: [number,number]
    rangeMin: number
    rangeMax: number
    valueMin: number
    valueMax: number
    tickCount?: number
    step?: number
    delayMs?: number
    controlled: boolean
    category: string
    decimals: number
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

export default function DualSlider({ category, decimals, rangeMin, rangeMax, valueMin, valueMax, tickCount=1, onChange, step=1, delayMs=500, onDrag, controlled }: Props) {

    // These values are only used if the component is not controlled
    const [localValues, setLocalValues] = useState<[number,number]>([rangeMin, rangeMax])
    
    
    // const [emitChange, setEmitChange] = useState(false)

    // useEffect(() => {
    //     setEmitChange(true)
    // }, [])

    // Reset values when range changes
    // useEffect(() => {
    //     console.log("new range:", range)
    //     setLocalValues([...range])
    // }, [range])

    // Whenever the page changes, reset the slider to the default min/max
    useEffect(() => {
        if(!controlled) {
            setLocalValues([rangeMin, rangeMax])
        }
    }, [rangeMin, rangeMax, controlled])


    function handleChange(a: number, b: number) {
        // if(emitChange) {
            if(onChange) {
                onChange(sort(a,b))
            }
            // if(localValues) {
            //     setLocalValues([a,b])
            // }
        // }
    }

    function handleDrag(a: number, b: number) {
        setLocalValues([a,b])
        if(onDrag) {
            onDrag(sort(a,b))
        }
    }

    function getValues() {
        const [min, max] = controlled ? [valueMin, valueMax] : localValues
        return [
            Math.max(rangeMin, min),
            Math.min(rangeMax, max),
        ]
    }


    return (
        <div css={ style }>

            <small>{ getValues().map(value => value?.toFixed(decimals))?.join(" - ") }</small>

            <div className="sliders">
                {/* <small>{ values.join(", ") }</small> */}
                <Slider
                    onChange={ value => handleChange(value, getValues()[1]) }
                    value={ getValues()[0] }
                    range={ [rangeMin, rangeMax] }
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
                    range={ [rangeMin, rangeMax] }
                    step={ step }
                    delayMs={ delayMs }
                    tickCount={ tickCount }
                    // onDrag={ (value) => setValues([values[0], value]) }
                    // onDrag={ value => { if(onDrag) onDrag([values[0],value]) } }
                    onDrag={ value => handleDrag(getValues()[0],value) }
                />
                <div className="track" style={{ background: `linear-gradient: (transparent})` }}/>
            </div>
            
        </div>
    )
}


const style = css`
    .sliders {
        position: relative;
        border-bottom: 2px solid #ddd;
        margin: 10px 0;
    }
`