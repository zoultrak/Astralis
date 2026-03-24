import Topbar from '@/components/Topbar'
import AutobusesTable from './AutobusesTable'

export default function AutobusesPage() {
    return (
        <>
            <Topbar title="Gestión de Flota" />
            <div className="page-content animate-fade-in">
                <div className="page-header">
                    <h1 className="page-title">Flota de Autobuses</h1>
                    <p className="page-subtitle">Administra los vehículos, mantenimientos y disponibilidad.</p>
                </div>
                <AutobusesTable />
            </div>
        </>
    )
}
