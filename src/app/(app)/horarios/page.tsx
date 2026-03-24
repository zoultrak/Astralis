import Topbar from '@/components/Topbar'
import HorariosTable from './HorariosTable'

export default function HorariosPage() {
    return (
        <>
            <Topbar title="Programación de Horarios" />
            <div className="page-content animate-fade-in">
                <div className="page-header">
                    <h1 className="page-title">Horarios</h1>
                    <p className="page-subtitle">Programa y administra los viajes de la línea.</p>
                </div>
                <HorariosTable />
            </div>
        </>
    )
}
