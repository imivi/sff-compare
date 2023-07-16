import { Options } from "@/utils/Options";
import { Query } from "@/utils/queryString/query";
import { useRouter } from "next/router";


export default function useQueryString(options: Options) {
    const router = useRouter()

    const query = new Query(router.query, options)

    function setQuery() {
        router.replace({
            query: query.stringify()
        })
    }
    
    return [query, setQuery]
}