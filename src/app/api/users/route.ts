import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"

export async function GET(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await prisma.user.findMany({
        select: { id: true, username: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const { username, password, role } = json

    if (!username || !password) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 12)

    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: role || 'USER'
            },
            select: { id: true, username: true, role: true }
        })
        return NextResponse.json(user)
    } catch (e) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }
}
