import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import SessionProvider from '@/components/SessionProvider'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    if (!session) redirect('/login')

    return (
        <SessionProvider session={session}>
            <div className="app-shell">
                <Sidebar />
                <main className="app-main">
                    {children}
                </main>
            </div>
        </SessionProvider>
    )
}
