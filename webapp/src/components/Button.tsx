import { ButtonHTMLAttributes, ReactNode } from "react"
import s from "./Button.module.scss"

type Props = {
    disabled?: boolean
    children: ReactNode
    style?: "standard" | "special"
    onClick?: () => void
    inline?: boolean
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
}

export default function Button({ disabled = false, onClick, style = "standard", inline = false, type = "button", children }: Props) {

    return (
        <button
            className={s.button}
            onClick={onClick}
            disabled={disabled}
            data-style={style}
            data-inline={inline}
            type={type}
        >
            {children}
        </button>
    )
}