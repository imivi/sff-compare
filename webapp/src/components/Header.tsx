import s from "./Header.module.scss"

import Link from "next/link";
import { IconBrandGithub, IconCube, IconFileSpreadsheet, IconLayoutSidebarLeftCollapse, IconLayoutSidebarRightCollapse } from "@tabler/icons-react";
import { useLayoutStore } from "@/store/useLayoutStore";
import Button from "./Button";
import { useFilterStore } from "@/store/useFiltersStore";
import Search from "./Search";
import { useSelectionStore } from "@/store/useSelectionStore";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";


function formatDate(date: Date): string {
    return date.toDateString()
}


export function Header() {

    const showSidebar = useLayoutStore(store => store.showSidebar)
    const toggleShowSidebar = useLayoutStore(store => store.toggleShowSidebar)

    const toggleViewer = useLayoutStore(store => store.toggleViewer)

    const activeFilters = useFilterStore(store => Object.keys(store.filters).length)

    const selectedCases = useSelectionStore(store => store.selectedCaseIds.size)

    const lastUpdateQuery = useQuery({
        queryKey: ["last-update"],
        queryFn: api.getLastUpdateDate,
    })

    const filters = useFilterStore(store => store.filters)

    return (
        <header className={s.container}>
            <Button onClick={toggleShowSidebar} style="special">
                {
                    showSidebar
                        ? <IconLayoutSidebarLeftCollapse size={20} />
                        : <IconLayoutSidebarRightCollapse size={20} />
                }
                {showSidebar ? `Hide filters` : `Show filters`} {activeFilters > 0 && `(${activeFilters})`}
            </Button>

            <Search />


            <div className={s.title}>
                {
                    lastUpdateQuery.data &&
                    <small>Updated {formatDate(new Date(lastUpdateQuery.data))}</small>
                }
                <Link href="https://docs.google.com/spreadsheets/d/1AddRvGWJ_f4B6UC7_IftDiVudVc8CJ8sxLUqlxVsCz4/edit#gid=534210212" target="_blank" rel="noreferrer">
                    <IconFileSpreadsheet stroke={1} />
                </Link>
                <Link href="https://github.com/imivi/sff-compare" target="_blank" rel="noreferrer">
                    <IconBrandGithub stroke={1} />
                </Link>
            </div>

            {/* <Link href={{ pathname: "/viewer", query: router.query }}> */}
            <Button onClick={toggleViewer} style="special">
                <IconCube size={20} />&nbsp;3D View {selectedCases > 0 && `(${selectedCases})`}
            </Button>

        </header>
    )
}