import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { SignOutButton } from "@/components/SignOutButton"
import { FileText, Plus, Users } from "lucide-react"

export default async function Home() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login')
  }

  const where = session.user.role === 'ADMIN' ? {} : { userId: session.user.id }

  const reports = await prisma.report.findMany({
    where,
    include: { user: { select: { username: true } } },
    orderBy: { date: 'desc' },
    take: 10
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Daily Reports
                </h1>
                <p className="text-gray-600 text-sm">Welcome back, <span className="font-medium">{session.user.name}</span> ({session.user.role})</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Link
            href="/report/new"
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Write New Report
          </Link>
          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin/users"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-5 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Users className="w-5 h-5" />
              Manage Users
            </Link>
          )}
        </div>

        {/* Reports List */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reports</h2>
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow border border-gray-100 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="font-semibold text-lg text-gray-800">
                      {new Date(report.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                    {report.user.username}
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{report.content}</p>
                <div className="text-xs text-gray-400 mt-3">
                  Submitted {new Date(report.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No reports found</p>
                <p className="text-gray-400 text-sm">Start by creating your first report!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
