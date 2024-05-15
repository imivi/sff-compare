import { FormEvent } from "react"
import s from "./Modal.module.scss"
import { MathUtils } from "three"
import { SffCase } from "@/types"
import Button from "../Button"

type Props = {
    show: boolean
    onClose: () => void
    onCreated: (newCase: SffCase) => void
}

export default function Modal({ show, onClose, onCreated }: Props) {

    function handleConfirm(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const values = Object.fromEntries(new FormData(form).entries())

        const label = values.name.toString().trim()

        const case_length_mm = Number(values.length_mm.toString())
        const case_width_mm = Number(values.width_mm.toString())
        const case_height_mm = Number(values.height_mm.toString())

        if (!label || !case_length_mm || !case_width_mm || !case_height_mm) {
            return
        }

        const newCase: SffCase = {
            label,
            id: MathUtils.generateUUID().slice(0, 8),
            size: [case_width_mm, case_height_mm, case_length_mm],
            volume: (case_length_mm / 100) * (case_width_mm / 100) * (case_height_mm / 100),
            footprint: (case_length_mm / 10) * (case_width_mm / 10),
        }

        form.reset()
        onClose()
        onCreated(newCase)
    }

    return (
        <div className={s.container} data-show={show}>
            <form className={s.content} onSubmit={(e) => handleConfirm(e)}>
                <label>Name<input required type="text" name="name" /></label>
                <label>Length (mm)<input required type="number" name="length_mm" min={0} max={1000} step={1} /></label>
                <label>Width (mm)<input required type="number" name="width_mm" min={0} max={1000} step={1} /></label>
                <label>Height (mm)<input required type="number" name="height_mm" min={0} max={1000} step={1} /></label>

                <footer>
                    <Button type="button" onClick={onClose} inline>Cancel</Button>
                    <Button type="submit" inline>Add case</Button>
                </footer>
            </form>
            <div className={s.bg} onClick={(e) => onClose()}></div>
        </div>
    )
}