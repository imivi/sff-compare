import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./Components"; // example render components - source below

const sliderStyle = {
    position: "relative",
    width: "100%"
}


// const domain: [number,number] = [0, 500]
// // const defaultValues = [450, 400, 300, 150]
// const defaultValues = [100, 400]


type Props = {
    domain: [number,number],
    minValue: number,
    maxValue: number,
    tickCount?: number,
    /**
     * Fires when a handle stops being dragged
     * @param the new values
     */
    onChange: (newValues: readonly number[]) => unknown,
}

export default function MultiSlider({ domain, minValue, maxValue, tickCount=1, onChange }: Props) {

    // Fires continuously while the handles are dragged
    // function onUpdate(values: readonly number[]) {
    //     console.log(values)
    // }

    // Fires when a handle stops being dragged
    // function onChange(values: readonly number[]) {
    //     console.log(values)
    // }

    return (
        <div style={{ margin: "10%", height: 120, width: "80%" }}>
            <Slider
                mode={2}
                step={1}
                domain={domain}
                rootStyle={sliderStyle}
                // onUpdate={ (values) => onUpdate(values) }
                onChange={ onChange }
                values={ [minValue,maxValue] }
            >
                <Rail>
                    {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
                </Rail>
                <Handles>
                    {({ handles, getHandleProps }) => (
                        <div className="slider-handles">
                            {handles.map((handle) => (
                                <Handle
                                    key={handle.id}
                                    handle={handle}
                                    domain={domain}
                                    getHandleProps={getHandleProps}
                                />
                            ))}
                        </div>
                    )}
                </Handles>
                <Tracks left={false} right={false}>
                    {({ tracks, getTrackProps }) => (
                        <div className="slider-tracks">
                            {tracks.map(({ id, source, target }) => (
                                <Track
                                    key={id}
                                    source={source}
                                    target={target}
                                    getTrackProps={getTrackProps}
                                />
                            ))}
                        </div>
                    )}
                </Tracks>
                <Ticks count={ tickCount }>
                    {({ ticks }) => (
                        <div className="slider-ticks">
                            {ticks.map((tick) => (
                                <Tick
                                    key={tick.id}
                                    tick={tick}
                                    count={ticks.length}
                                    format={ (n) => n.toString() }
                                />
                            ))}
                        </div>
                    )}
                </Ticks>
            </Slider>
        </div>
    )
}
