// @flow weak

import { CSSProperties, Fragment } from "react";
// import PropTypes from "prop-types";

// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle: CSSProperties = {
    position: "absolute",
    width: "100%",
    height: 40,
    transform: "translate(0%, -50%)",
    borderRadius: 7,
    cursor: "pointer"
    // border: '1px solid white',
};

const railInnerStyle: CSSProperties = {
    position: "absolute",
    width: "100%",
    height: 8,
    transform: "translate(0%, -50%)",
    borderRadius: 7,
    pointerEvents: "none",
    backgroundColor: "#ddd"
}

export function SliderRail({ getRailProps }: any) {
    return (
        <Fragment>
            <div style={railOuterStyle} {...getRailProps()} />
            <div style={railInnerStyle} />
        </Fragment>
    );
}


// *******************************************************
// HANDLE COMPONENT
// *******************************************************

type HandleProps = {
    domain: [number, number],
    handle: { id: string, value: number, percent: number },
    disabled?: boolean,
    getHandleProps: any,
}

export function Handle({ domain, handle, disabled, getHandleProps }: HandleProps) {

    const [min,max] = domain
    
    return (
        <Fragment>
            <div
                style={{
                    left: `${ handle.percent }%`,
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    WebkitTapHighlightColor: "rgba(0,0,0,0)",
                    zIndex: 5,
                    width: 28,
                    height: 42,
                    cursor: "pointer",
                    // border: '1px solid white',
                    backgroundColor: "none"
                }}
                {...getHandleProps(handle.id)}
            />
            <div
                role="slider"
                aria-valuemin={ min }
                aria-valuemax={ max }
                aria-valuenow={ handle.value }
                style={{
                    left: `${ handle.percent }%`,
                    position: "absolute",
                    transform: "translate(-50%, -50%)",
                    zIndex: 2,
                    width: 16,
                    height: 16,
                    aspectRatio: 1,
                    borderRadius: "50%",
                    // boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.3)",
                    backgroundColor: disabled ? "#999" : "#2684ff",
                }}
            />
        </Fragment>
    );
}

// *******************************************************
// KEYBOARD HANDLE COMPONENT
// Uses a button to allow keyboard events
// *******************************************************

export function KeyboardHandle({ domain, handle, disabled, getHandleProps }: HandleProps) {
    const [min,max] = domain

    return (
        <button
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={handle.value}
            style={{
                left: `${handle.percent}%`,
                position: "absolute",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
                width: 24,
                height: 24,
                borderRadius: "50%",
                // boxShadow: "1px 1px 1px 1px rgba(0, 0, 0, 0.3)",
                backgroundColor: disabled ? "#999" : "#5797f8",
            }}
            {...getHandleProps(handle.id)}
        />
    );
}

// KeyboardHandle.propTypes = {
//     domain: PropTypes.array.isRequired,
//     handle: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         value: PropTypes.number.isRequired,
//         percent: PropTypes.number.isRequired
//     }).isRequired,
//     getHandleProps: PropTypes.func.isRequired,
//     disabled: PropTypes.bool
// };

// KeyboardHandle.defaultProps = {
//     disabled: false
// };

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export function Track({ source, target, getTrackProps, disabled }: any) {
    return (
        <div
            style={{
                position: "absolute",
                transform: "translate(0%, -50%)",
                height: 8,
                zIndex: 1,
                backgroundColor: disabled ? "#999" : "#afd0ec",
                borderRadius: 7,
                cursor: "pointer",
                left: `${source.percent}%`,
                width: `${target.percent - source.percent}%`
            }}
            {...getTrackProps()}
        />
    );
}

// Track.propTypes = {
//     source: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         value: PropTypes.number.isRequired,
//         percent: PropTypes.number.isRequired
//     }).isRequired,
//     target: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         value: PropTypes.number.isRequired,
//         percent: PropTypes.number.isRequired
//     }).isRequired,
//     getTrackProps: PropTypes.func.isRequired,
//     disabled: PropTypes.bool
// };

// Track.defaultProps = {
//     disabled: false
// };

// *******************************************************
// TICK COMPONENT
// *******************************************************
type TickProps = {
    tick: {
        percent: number,
        value: number,
    },
    count: number,
    format: (n: number) => string,
}
export function Tick({ tick, count, format }: TickProps) {
    return (
        <div>
            <div
                style={{
                    position: "absolute",
                    marginTop: 14,
                    width: 1,
                    height: 5,
                    backgroundColor: "rgb(200,200,200)",
                    left: `${tick.percent}%`
                }}
            />
            <div
                style={{
                    position: "absolute",
                    marginTop: 22,
                    fontSize: 10,
                    textAlign: "center",
                    marginLeft: `${-(100 / count) / 2}%`,
                    width: `${100 / count}%`,
                    left: `${tick.percent}%`
                }}
            >
                {format(tick.value)}
            </div>
        </div>
    );
}

// Tick.propTypes = {
//     tick: PropTypes.shape({
//         id: PropTypes.string.isRequired,
//         value: PropTypes.number.isRequired,
//         percent: PropTypes.number.isRequired
//     }).isRequired,
//     count: PropTypes.number.isRequired,
//     format: PropTypes.func.isRequired
// };

// Tick.defaultProps = {
//     format: d => d
// };
