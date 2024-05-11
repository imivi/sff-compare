import { IconLoader } from "@tabler/icons-react";
import s from "./LoadingSpinnder.module.scss"


type Props = {
    size?: number
}


export default function LoadingSpinner({ size = 32 }: Props) {
    return (
        <div className={s.container}>
            <IconLoader size={size} />
        </div>
    )
}