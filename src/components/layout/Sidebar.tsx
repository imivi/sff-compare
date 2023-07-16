import { css } from "@emotion/react"
import { useRouter } from "next/router"
import FilterControl from "../FilterControl"
import { ReactNode, useState } from "react"
import Footer from "./Footer"
import { blacklist, hiddenFilters } from "@/utils/googleSheetsUrls"
import Image from "next/image"
import Logo from "@/../public/cube.png"
import { GithubLink } from "../GithubLink"
import Link from "next/link"
import { pages, tabNames } from "@/data"
import { Query } from "@/utils/queryString/query"
import { Options } from "@/utils/Options"
import Button from "../utility/Button"
import Select from "../utility/Select"


type Props = {
    children?: ReactNode
}

export default function Sidebar({ children }: Props) {

    const router = useRouter()

    const path = router.asPath.slice(1) // Remove leading slash
    const pathWithoutQuery = (path.includes("?") ? path.split("?")[0] : path).replaceAll("/","")

    // console.log({ path, pathWithoutQuery })

    return (
        <div css={ style }>

            <div>
                <h1>
                    <GithubLink/>
                    {/* <Box size={ 40 } strokeWidth={1}/> */}
                    <Image src={ Logo } alt="SFF Compare logo" width={ 32 }/>
                    <Link href={ "/"+pages[0] }>SFF Compare</Link>
                </h1>

                <Select onChange={ (e) => router.push(pathWithoutQuery.includes("compare") ? e.target.value+"/compare" : e.target.value) }>
                    {
                        Object.entries(tabNames).map(([page,tabName]) => (
                            <option value={ "/"+page } key={ page }>
                                { tabName }
                            </option>
                        ))
                    }
                </Select>

                { children }

            </div>

            <Footer/>
        </div>
    )
}

const style = css`
    /* display: grid; */
    /* min-height: 100vh; */
    /* height: 100vh; */
    /* position: fixed; */
    /* left: 0; */
    /* top: 0; */
    /* max-width: 500px; */
    /* border: 1px solid brown; */
    /* flex-wrap: wrap; */
    /* gap: 1em; */
    /* grid-template-columns: repeat(3, 1fr); */
    /* max-height: min(50vh, 500px); */
    /* overflow: auto; */
    /* margin-bottom: 3vh; */
    /* padding-bottom: 10em; */
    width: 100%;
    height: 100%;
    /* position: relative; */
    /* z-index: 1; */
    /* position: relative; */
    background-color: #f4f4f4;

    border-right: 1px solid #ddd;
    box-shadow: 5px 0 15px rgba(0,0,0, 0.1);

    display: grid;
    grid-template-rows: 1fr auto;

    overflow-y: auto;


    & > div {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
        overflow-y: auto;
        width: 100%;
        height: 100%;
    }

    h1 {
        display: flex;
        place-content: center;
        place-items: center;
        gap: .3em;
        font-weight: normal;
        padding: 1em;
        margin: 0;
        position: relative;

        a {
            color: inherit;
            text-decoration: inherit;
        }
    }

    .controls {
        padding: 0 1em;
    }

`