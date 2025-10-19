import Logo from "@/components/ui/logo";
import { useTheme } from "@/context/ThemeContext";

const DashboardHeader = () => {
  const { currentTheme } = useTheme();
  const isMiaTheme = currentTheme === 'mia';

  return (
    <div className={`relative -mx-6 lg:-mx-8  lg:-mt-8 px-6 lg:px-8 py-1 lg:py-1 mb-2 lg:mb-3 ${isMiaTheme ? 'bg-gradient-mia' : 'bg-gradient-primary'} overflow-hidden border-b border-white/10 rounded-xl`}>     
      {/* Puntos decorativos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-8 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute top-8 left-16 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-white rounded-full"></div>
        <div className="absolute top-12 right-8 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute bottom-6 left-12 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute bottom-8 right-16 w-2 h-2 bg-white rounded-full"></div>
        <div className="absolute bottom-4 right-24 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-4 w-1 h-1 bg-white rounded-full"></div>
        <div className="absolute top-1/3 right-6 w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>
      <div className="relative max-w-7xl mx-auto text-center">
        <h1 className="text-3xl lg:text-5xl font-bold mb-0.5 text-white drop-shadow-lg">
          Dashboard MIA
        </h1>
        <p className="text-white/95 text-lg lg:text-xl drop-shadow-md">
          Sistema de Caracterización Poblacional - MIA
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
