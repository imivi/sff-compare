import s from "./Search.module.scss"

import { useEffect, useRef, useState } from "react"
import { IconSearch, IconX } from "@tabler/icons-react"
import { useRouter } from "next/router"
import { useQueryParams } from "@/hooks/useQueryParams"
import { useLayoutStore } from "@/store/useLayoutStore"
import { useSearchStore } from "@/store/useSearchStore"


export default function Search() {

    const router = useRouter()

    const { search } = useQueryParams()

    const [inputValue, setInputValue] = useState(search)

    const maximizeViewer = useLayoutStore(store => store.maximizeViewer)
    const toggleMaximizeViewer = useLayoutStore(store => store.toggleMaximizeViewer)

    // Only enable fuse search if the user has clicked on the search input field,
    // or if a search value is specified in the query string.
    // const [enableSearch, setEnableSearch] = useState(search !== "")
    const setSearchEnabled = useSearchStore(store => store.setSearchEnabled)

    useEffect(() => {
        setInputValue(search)
        if (search !== "")
            setSearchEnabled(true)
    }, [search, setSearchEnabled])


    const timeoutIdRef = useRef<number>()

    function handleInput(text: string) {
        setInputValue(text)
        if (timeoutIdRef) {
            window.clearTimeout(timeoutIdRef.current)
        }
        const id = window.setTimeout(() => {
            // Shrink the 3D viewer so that the user can see the results
            if (maximizeViewer)
                toggleMaximizeViewer()

            router.push({
                query: {
                    ...router.query,
                    search: text,
                }
            })
        }, 500)
        timeoutIdRef.current = id
    }

    return (
        <div className={s.container}>
            <label data-highlight={inputValue !== ""}>
                <IconSearch size={20} />

                <input type="text"
                    value={inputValue}
                    onChange={(e) => handleInput(e.target.value)}
                    onFocus={() => setSearchEnabled(true)}
                    placeholder="Search..."
                />
                {
                    inputValue !== "" &&
                    <button className="g-unstyled" onClick={() => handleInput("")} >
                        <IconX size={20} color="black" />
                    </button>
                }
            </label>

        </div>
    )
}