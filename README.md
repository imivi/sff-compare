This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## PARSE FILTERS FROM QUERY STRING


?asc=true&col=0&fil=1:3,4,5;10:11,12,13

->

fil=1:3,4,5;10:11,12,13

->

1:  3,4,5
10: 11,12,13

-> (provide headers and sorted options aka "possibleValues")

{
    "Brand": ["Alpenfohn", "AMD", "Arctic],
    "Fan size": [...],
}