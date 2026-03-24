import Topbar from '@/components/Topbar'
import ConductoresTable from './ConductoresTable'

export default function ConductoresPage() {
    return (
        <>
            <Topbar title="Administración de Conductores" />
            <div className="page-content animate-fade-in">
                <div className="page-header">
                    <h1 className="page-title">Conductores</h1>
                    <p className="page-subtitle">Gestiona el personal de conducción, licencias y disponibilidad.</p>
                </div>
                <ConductoresTable />
            </div>
        </>
    )
}
