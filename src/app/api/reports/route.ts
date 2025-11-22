import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    let where = {}
    if (session.user.role !== 'ADMIN') {
        // Regular users can only see their own reports
        where = { userId: session.user.id }
    } else if (userId) {
        // Admin can filter by user
        where = { userId }
    }

    const reports = await prisma.report.findMany({
        where,
        include: { user: { select: { username: true } } },
        orderBy: { date: 'desc' }
    })

    return NextResponse.json(reports)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const { content, date } = json

    const report = await prisma.report.create({
        data: {
            content,
            date: new Date(date),
            userId: session.user.id
        }
    })

    return NextResponse.json(report)
}
