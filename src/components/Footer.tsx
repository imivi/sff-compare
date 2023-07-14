import { ExternalLink } from "tabler-icons-react"
import { css } from "@emotion/react"
import { googleSheetsLink } from "@/utils/googleSheetsUrls"



export default function Footer() {

    return (
        <footer css={style}>
            <span>Data from</span>
            <a href={ googleSheetsLink } rel="noreferrer" target="_blank">
                SFF PC Master List <ExternalLink size={ 16 }/>
            </a>
            {/* <span>by u/prayogahs with contribution from u/ermac-318</span> */}
        </footer>
    )
}

const style = css`
    background-color: #eee;
    color: #777;
    display: flex;
    place-content: center;
    place-items: center;
    /* border: 1px solid #ddd; */
    border-top: 1px solid #ddd;
    gap: .2em;
    /* padding: .5vh 1vw; */
    font-size: .9em;
    padding: .8em;
    width: 100%;
    height: 100%;

    box-shadow: 0 -5px 25px rgba(0,0,0, 0.15);

    a {
        color: dodgerblue;
        text-decoration: none;
        font-weight: bold;
        display: flex;
        place-items: center;
        gap: .3em;
    }
`