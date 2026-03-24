'use client'

interface TopbarProps {
    title: string
    children?: React.ReactNode
}

export default function Topbar({ title, children }: TopbarProps) {
    return (
        <header className="topbar">
            <span className="topbar-title">{title}</span>
            <div className="topbar-actions">{children}</div>
        </header>
    )
}
