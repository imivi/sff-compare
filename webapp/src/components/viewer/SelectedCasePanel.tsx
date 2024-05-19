import s from "./SelectedCasePanel.module.scss"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/api"
import { useFetchColumns } from "@/hooks/useFetchColumns"
import { SffCase } from "@/types"

type Props = {
    sffCaseId: string
    customCases: SffCase[]
}

export default function SelectedCasePanel({ sffCaseId, customCases }: Props) {

    const customCase = customCases.find(c => c.id === sffCaseId)

    return (
        <div className={s.container}>
            {
                customCase
                    ? (
                        <table>
                            <tr>
                                <td>Name</td>
                                <td>{customCase.label}</td>
                            </tr>
                            <tr>
                                <td>Case Length (mm)</td>
                                <td>{customCase.size[2]}</td>
                            </tr>
                            <tr>
                                <td>Case Width (mm)</td>
                                <td>{customCase.size[0]}</td>
                            </tr>
                            <tr>
                                <td>Case Height (mm)</td>
                                <td>{customCase.size[1]}</td>
                            </tr>
                            <tr>
                                <td>Volume (L)</td>
                                <td>{customCase.volume}</td>
                            </tr>
                            <tr>
                                <td>Footprint (cm2)</td>
                                <td>{customCase.footprint}</td>
                            </tr>
                        </table>
                    )
                    : <RemoteQueryTable caseId={sffCaseId} />
            }

        </div >
    )
}



function RemoteQueryTable({ caseId }: { caseId: string }) {

    const { data: columns, loading, error } = useFetchColumns()

    const getCaseQuery = useQuery({
        queryKey: ["case", caseId],
        queryFn: () => api.getItem(caseId),
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
        <table>
            {
                Object.keys(getCaseQuery.data).filter(col => col !== "id").map(column => {
                    if (!getCaseQuery.data)
                        return null
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
    )
}