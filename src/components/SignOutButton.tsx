'use client'
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut()}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
        >
            <LogOut className="w-4 h-4" />
            Sign Out
        </button>
    )
}
