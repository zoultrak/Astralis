import Topbar from '@/components/Topbar'
import UsuariosTable from './UsuariosTable'

export default function UsuariosPage() {
    return (
        <>
            <Topbar title="Administración de Usuarios" />
            <div className="page-content animate-fade-in">
                <div className="page-header">
                    <h1 className="page-title">Usuarios del sistema</h1>
                    <p className="page-subtitle">Gestiona cuentas, roles y permisos de acceso al sistema.</p>
                </div>
                <UsuariosTable />
            </div>
        </>
    )
}
