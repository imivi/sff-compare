import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type ColumnMetadata } from "../types"
import { api } from "../api";



export function useFetchColumns(): { data: ColumnMetadata[], loading: boolean, error: boolean } {

    const getColumnsQuery = useQuery<ColumnMetadata[]>({
        queryKey: ["columns"],
        queryFn: api.getColumnsMetadata,
    })

    if (getColumnsQuery.data) {
        return {
            data: getColumnsQuery.data,
            loading: false,
            error: false,
        }
    }

    return {
        data: [],
        loading: getColumnsQuery.isLoading,
        error: !!getColumnsQuery.error,
    }
}