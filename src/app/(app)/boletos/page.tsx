import Topbar from '@/components/Topbar'
import BoletosPos from './BoletosPos'

export default function BoletosPage() {
    return (
        <>
            <Topbar title="Venta de Boletos — POS" />
            <div className="page-content animate-fade-in">
                <div className="page-header">
                    <h1 className="page-title">Punto de Venta</h1>
                    <p className="page-subtitle">Selecciona un horario, asiento y registra la venta al pasajero.</p>
                </div>
                <BoletosPos />
            </div>
        </>
    )
}
