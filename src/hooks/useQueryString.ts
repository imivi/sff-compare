import { deserializeFilters } from "@/utils/queryString/deserializeFilters";
import { useRouter } from "next/router";

export default function useQueryString() {
    const router = useRouter()

    const filterQuery = router.query?.fil || router.query?.fil

    const filters = typeof filterQuery === "string" ? deserializeFilters(filterQuery) : {}

    return filters
}