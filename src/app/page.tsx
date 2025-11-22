import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { SignOutButton } from "@/components/SignOutButton"

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const where = session.user.role === 'ADMIN' ? {} : { userId: session.user.id }

  const reports = await prisma.report.findMany({
    where,
    include: { user: { select: { username: true } } },
    orderBy: { date: 'desc' }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Daily Reports</h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">Hello, {session.user.name} ({session.user.role})</span>
            <SignOutButton />
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <Link
            href="/report/new"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Write New Report
          </Link>
          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin/users"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Manage Users
            </Link>
          )}
        </div>

        <div className="space-y-4">
          {reports.map(report => (
            <div key={report.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-lg text-gray-800">
                  {new Date(report.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-500">
                  {report.user.username}
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{report.content}</p>
              <div className="text-xs text-gray-400 mt-4">
                Submitted on {new Date(report.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <p className="text-center text-gray-500 py-8">No reports found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
