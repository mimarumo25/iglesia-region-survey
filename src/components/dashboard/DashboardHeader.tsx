const DashboardHeader = () => {
  return (
    <div className="relative -mx-6 lg:-mx-8 -mt-6 lg:-mt-8 px-6 lg:px-8 py-8 lg:py-12 mb-8 lg:mb-10 bg-gradient-animated overflow-hidden animate-slide-in-left">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
      <div className="relative max-w-7xl mx-auto">
        <h1 className="text-3xl lg:text-5xl font-bold mb-3 text-white animate-bounce-in">
          Panel de Control
        </h1>
        <p className="text-white/90 text-lg lg:text-xl animate-slide-in-right">
          Sistema de Caracterización Poblacional - Parroquia
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;
