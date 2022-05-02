# svg-to-png-buffer

Simple API that takes in a base64 SVG encoded image, and returns a base64 PNG encoded image. Particularly useful for rendering SVG NFTs in discord bots or twitter bots.

Example usage:
`
curl --location --request POST 'https://svg-to-png-buffer-backed.vercel.app/api/svgToPngBuffer' \
--header 'Content-Type: application/json' \
--data-raw '{
    "svg":"data:image/svg+xml;base64,<base-64-svg-here>"
}'
`

Return response looks like:
`
{
    pngBuffer: <base-64-png-here>
}
`
