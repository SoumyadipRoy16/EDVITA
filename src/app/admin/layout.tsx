import { ReactNode } from 'react'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-128px)] overflow-hidden"> {/* Adjusted to fixed height */}
      <aside className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/manage-questions" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Manage Questions
              </Link>
            </li>
            <li>
              <Link href="/admin/monitor-results" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Monitor Results
              </Link>
            </li>
            <li>
              <Link href="/admin/approve-applications" className="block py-2 px-4 hover:bg-gray-700 rounded">
                Approve Applications
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}