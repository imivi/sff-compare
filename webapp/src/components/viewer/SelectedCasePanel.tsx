import s from "./SelectedCasePanel.module.scss"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/api"
import { useFetchColumns } from "@/hooks/useFetchColumns"

type Props = {
    sffCaseId: string
}

export default function SelectedCasePanel({ sffCaseId }: Props) {

    const { data: columns, loading, error } = useFetchColumns()

    const getCaseQuery = useQuery({
        queryKey: ["case", sffCaseId],
        queryFn: () => api.getItem(sffCaseId),
    })

    const columnLabels = useMemo(() => {
        const labels: Record<string, string> = {}
        for (const col of columns) {
            labels[col.key] = col.label
        }
        return labels
    }, [columns])

    if (!getCaseQuery.data || loading || error) {
        return null
    }

    return (
        <div className={s.container}>
            <table>
                {
                    Object.keys(getCaseQuery.data).filter(col => col !== "id").map(column => {
                        const value = getCaseQuery.data[column]
                        if (!value)
                            return null
                        return (
                            <tr key={column}>
                                <td>{columnLabels[column]}</td>
                                <td>{value}</td>
                            </tr>
                        )
                    })
                }
            </table>
        </div>
    )
}