'use client'
import { signOut } from "next-auth/react"

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="text-red-600 hover:text-red-800 font-medium"
        >
            Sign Out
        </button>
    )
}
