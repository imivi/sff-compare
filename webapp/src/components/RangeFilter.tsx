import s from "./RangeFilter.module.scss"

import { useFilterStore } from "../store/useFiltersStore"
import { ColumnMetadataNumerical } from "../types"
import Filter from "./Filter"
import { useEffect, useRef, useState } from "react"


type Props = {
    columnMetadata: ColumnMetadataNumerical,
}

export default function RangeFilter({ columnMetadata }: Props) {

    const state = useFilterStore(store => store.filters[columnMetadata.key])
    const setFilterMin = useFilterStore(store => store.setFilterMin)
    const setFilterMax = useFilterStore(store => store.setFilterMax)

    const range = columnMetadata.max - columnMetadata.min
    const integerSlider = !columnMetadata.integer && range < 10
    const step = integerSlider ? 1 : 0.1

    if (state && !state.numerical) {
        return null
    }

    function getDefaultMinValue() {
        return Math.floor(columnMetadata.min)
    }

    function getDefaultMaxValue() {
        return Math.ceil(columnMetadata.max)
    }

    const min = state?.min ?? getDefaultMinValue()
    const max = state?.max ?? getDefaultMaxValue()

    function onChangeMin(value: number) {
        if (value > max) {
            value = max
        }
        if (value <= max) {
            setFilterMin(columnMetadata.key, value, columnMetadata.min, columnMetadata.max)
        }
    }

    function onChangeMax(value: number) {
        if (value < min) {
            value = min
        }
        if (value >= min) {
            setFilterMax(columnMetadata.key, value, columnMetadata.min, columnMetadata.max)
        }
    }


    const fullRange = columnMetadata.max - columnMetadata.min
    let startPercent = (min - columnMetadata.min) / fullRange * 100
    startPercent = Math.max(startPercent, 0)
    let endPercent = (max - columnMetadata.min) / fullRange * 100
    endPercent = Math.min(endPercent, 100)

    const rangePercent = endPercent - startPercent

    const filterIsAdjusted = min !== getDefaultMinValue() || max !== getDefaultMaxValue()
    // const filterIsAdjusted = Math.abs(min - getDefaultMinValue()) > 1 || Math.abs(max - getDefaultMaxValue()) > 1


    return (
        <Filter filterKey={columnMetadata.key} highlight={filterIsAdjusted} label={columnMetadata.label}>
            <div className={s.container} data-adjusted={filterIsAdjusted} >

                <div className={s.inputs}>

                    <NumberInput
                        defaultValue={columnMetadata.min}
                        value={min}
                        step={step}
                        min={Math.floor(columnMetadata.min)}
                        max={Math.ceil(columnMetadata.max)}
                        onValidChange={(n) => onChangeMin(n)}
                    />
                    -
                    <NumberInput
                        defaultValue={columnMetadata.min}
                        value={max}
                        step={step}
                        min={Math.floor(columnMetadata.min)}
                        max={Math.ceil(columnMetadata.max)}
                        onValidChange={(n) => onChangeMax(n)}
                    />
                </div>

                <div className={s.slider_container}>

                    <span className={s.label_range_minmax}>{Math.floor(columnMetadata.min)}</span>
                    <div className={s.range_inputs}>
                        <input
                            type="range"
                            className={s.dual_slider}
                            name=""
                            id=""
                            min={Math.floor(columnMetadata.min)}
                            max={Math.ceil(columnMetadata.max)}
                            value={min}
                            onChange={(e) => onChangeMin(e.target.valueAsNumber)}
                        />
                        <input
                            type="range"
                            className={s.dual_slider}
                            name=""
                            id=""
                            min={Math.floor(columnMetadata.min)}
                            max={Math.ceil(columnMetadata.max)}
                            value={max}
                            onChange={(e) => onChangeMax(Number(e.target.value))}
                        />

                        <div className={s.slider_track_full}></div>
                        <div className={s.slider_track_active} style={{ width: `${rangePercent}%`, left: `${startPercent}%` }}></div>
                    </div>
                    <span className={s.label_range_minmax}>{Math.ceil(columnMetadata.max)}</span>
                </div>

            </div>
        </Filter>
    )
}

type NumberInputProps = {
    defaultValue: number
    value: number
    step: number
    min: number
    max: number
    onValidChange: (n: number) => void
}

function NumberInput({ defaultValue, value, step, min, max, onValidChange }: NumberInputProps) {

    // By default, show the supplied value
    // Only show the typed number if it's not valid

    const inputRef = useRef<HTMLInputElement>(null)

    const [typedValue, setTypedValue] = useState<string>(defaultValue.toString())
    const parsedTypedValue = Number(typedValue)


    useEffect(() => {
        setTypedValue(value.toString())
    }, [value])

    function inputIsValid(): boolean {
        if (parsedTypedValue === Number.NaN)
            return false
        const valid = parsedTypedValue >= min && parsedTypedValue <= max
        return valid
    }

    const valueToDisplay = typedValue

    function handleInput(numString: string) {
        setTypedValue(numString)

        const num = Number(numString)
        if (num !== Number.NaN && num >= min && num <= max) {
            onValidChange(num)
        }
    }

    return (<>
        <input
            type="number"
            data-error={!inputIsValid()}
            value={valueToDisplay}
            onChange={(e) => handleInput(e.target.value)}
            min={min}
            max={max}
            step={step}
            ref={inputRef}
        />
    </>
    )
}