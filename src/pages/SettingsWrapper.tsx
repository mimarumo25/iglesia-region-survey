import { useLocation } from 'react-router-dom';
import SettingsPage from './Settings';
import Parroquias from './Parroquias';
import Sectors from './Sectors';
import VeredasPage from './Veredas';
import Municipios from './Municipios';
import AguasResidualesPage from './AguasResiduales';
import TiposViviendaPage from './TiposVivienda';
import ParentescosPage from './Parentescos';
import EstadosCivilesPage from './EstadosCiviles';
import SexosPage from './Sexos';
import ComunidadesCulturalesPage from './ComunidadesCulturales';
import EstudiosPage from './Estudios';
import DepartamentosPage from './Departamentos';
import ProfesionesPage from './Profesiones';
import SectoresConfigPage from './SectoresConfig';
import EnfermedadesPage from './Enfermedades';
import DisposicionBasuraPage from './DisposicionBasura';

const SettingsWrapper = () => {
  const location = useLocation();
  
  // Determinar qué componente mostrar basado en la ruta
  const renderComponent = () => {
    switch (location.pathname) {
      case '/settings/parroquias':
        return <Parroquias />;
      case '/settings/veredas':
        return <VeredasPage />;
      case '/settings/sectors':
        return <Sectors />;
      case '/settings/municipios':
        return <Municipios />;
      case '/settings/aguas-residuales':
        return <AguasResidualesPage />;
      case '/settings/tipos-vivienda':
        return <TiposViviendaPage />;
      case '/settings/parentescos':
        return <ParentescosPage />;
      case '/settings/estados-civiles':
        return <EstadosCivilesPage />;
      case '/settings/sexos':
        return <SexosPage />;
      case '/settings/comunidades-culturales':
        return <ComunidadesCulturalesPage />;
      case '/settings/estudios':
        return <EstudiosPage />;
      case '/settings/departamentos':
        return <DepartamentosPage />;
      case '/settings/profesiones':
        return <ProfesionesPage />;
      case '/settings/sectores-config':
        return <SectoresConfigPage />;
      case '/settings/enfermedades':
        return <EnfermedadesPage />;
      case '/settings/disposicion-basura':
        return <DisposicionBasuraPage />;
      case '/settings':
      default:
        return <SettingsPage initialTab="general" />;
    }
  };

  return renderComponent();
};

export default SettingsWrapper;
