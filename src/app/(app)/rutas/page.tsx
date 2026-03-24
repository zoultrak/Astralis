import Topbar from '@/components/Topbar'
import RutasTable from './RutasTable'

export default function RutasPage() {
    return (
        <>
            <Topbar title="Gestión de Rutas" />
            <div className="page-content animate-fade-in">
                <div className="page-header flex items-center justify-between">
                    <div>
                        <h1 className="page-title">Rutas</h1>
                        <p className="page-subtitle">Administra las rutas de la línea de autobuses.</p>
                    </div>
                </div>
                <RutasTable />
            </div>
        </>
    )
}
