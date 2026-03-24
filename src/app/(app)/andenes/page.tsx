import Topbar from '@/components/Topbar'
import AndenesTable from './AndenesTable'

export default function AndenesPage() {
    return (
        <>
            <Topbar title="Control de Andenes" />
            <div className="page-content animate-fade-in">
                <div className="page-header">
                    <h1 className="page-title">Andenes</h1>
                    <p className="page-subtitle">Administra los andenes de la terminal y sus asignaciones a viajes.</p>
                </div>
                <AndenesTable />
            </div>
        </>
    )
}
