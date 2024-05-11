import { SffCase } from "@/types";
import { useState } from "react";

export function useCustomCases() {
    const [cases, setCases] = useState<SffCase[]>([])

    function addCustomCase(newCase: SffCase) {
        setCases([...cases, newCase])
    }

    function deleteCustomCase(caseId: string) {
        setCases(cases.filter(sffCase => sffCase.id !== caseId))
    }

    return {
        customCases: cases,
        addCustomCase,
        deleteCustomCase,
    }
}