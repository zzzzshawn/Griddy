import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pathname = url.pathname
    const pathSegments = pathname.split("/")
    const id = pathSegments[2]

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const response = await fetch(
      `https://pub-fd21440a971545968d1aa765101f1c1e.r2.dev/apollo/images/${id}.jpeg`,
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status },
      )
    }

    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="griddy.jpeg"',
        "Content-Type": "image/jpeg",
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to download image" }, { status: 500 })
  }
}
