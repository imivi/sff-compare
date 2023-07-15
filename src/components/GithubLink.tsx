import { css } from "@emotion/react"
import { BrandGithub } from "tabler-icons-react"



const githubUrl = "https://www.github.com"

export function GithubLink() {
    
    return (
        <a css={ style } href={ githubUrl } target="_blank" rel="noreferrer">
            <BrandGithub size={ 24 } color="white"/>
        </a>
    )
}

const style = css`
    position: absolute;
    top: 0;
    left: 0;
    /* background: linear-gradient(to bottom right, black 50%, transparent); */
    background-color: #333;
    clip-path: polygon(0 0, 100% 0, 0 100%);
    aspect-ratio: 1;
    width: 60px;
    height: 60px;
    display: flex;
    place-content: flex-start;
    place-items: flex-start;
    padding: 8px;
    transition: background-color 100ms;

    &:hover {
        background-color: #555;
    }
    &:active {
        background-color: #222;
    }
`