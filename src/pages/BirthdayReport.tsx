import { useEffect, useMemo, useState } from "react";
import { Calendar, Cake, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Autocomplete } from "@/components/ui/autocomplete";
import ReportActions from "@/components/reports/ReportActions";
import PersonasTable from "@/components/personas/PersonasTable";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { useGeographicFilters } from "@/hooks/useGeographicFilters";
import { useToast } from "@/hooks/use-toast";
import {
  exportPersonasCumpleanosExcel,
  getPersonasCumpleanos,
} from "@/services/personas";
import type { FiltrosCumpleanos, PersonaConsolidada } from "@/types/personas";

const MONTH_OPTIONS = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const currentMonth = new Date().getMonth() + 1;

const initialFilters: FiltrosCumpleanos = {
  mes_nacimiento: currentMonth,
  page: 1,
  limit: 100,
};

const toNumber = (value: string) => (value ? Number(value) : undefined);

const BirthdayReport = () => {
  const { toast } = useToast();
  const configData = useConfigurationData();
  const [filters, setFilters] = useState<FiltrosCumpleanos>(initialFilters);
  const [personas, setPersonas] = useState<PersonaConsolidada[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const geoFilters = useGeographicFilters({
    id_municipio: filters.id_municipio,
    id_parroquia: filters.id_parroquia,
    id_sector: filters.id_sector,
    id_vereda: filters.id_vereda,
    id_corregimiento: filters.id_corregimiento,
    id_centro_poblado: filters.id_centro_poblado,
  });

  const selectedMonthLabel = useMemo(() => {
    return MONTH_OPTIONS.find((month) => month.value === String(filters.mes_nacimiento))?.label || "-";
  }, [filters.mes_nacimiento]);

  const updateFilter = <K extends keyof FiltrosCumpleanos>(key: K, value: FiltrosCumpleanos[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const updateMunicipio = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      id_municipio: toNumber(value),
      id_parroquia: undefined,
      id_sector: undefined,
      id_vereda: undefined,
      id_corregimiento: undefined,
      id_centro_poblado: undefined,
      page: 1,
    }));
  };

  const fetchReport = async (nextFilters = filters) => {
    if (!nextFilters.mes_nacimiento) {
      toast({
        title: "Mes requerido",
        description: "Selecciona el mes de nacimiento para consultar cumpleaños.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await getPersonasCumpleanos(nextFilters);
      setPersonas(response.data || []);
      setTotal(response.total || 0);
      setFilters((prev) => ({
        ...prev,
        page: response.page || nextFilters.page || 1,
        limit: response.limit || nextFilters.limit || 100,
      }));
    } catch (error: any) {
      toast({
        title: "Error consultando cumpleaños",
        description: error.response?.data?.message || error.message || "No se pudo cargar el reporte.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    const nextFilters = { ...filters, page };
    setFilters(nextFilters);
    await fetchReport(nextFilters);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    setPersonas([]);
    setTotal(0);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportPersonasCumpleanosExcel(filters);
      toast({
        title: "Excel generado",
        description: `Reporte de cumpleaños de ${selectedMonthLabel} descargado correctamente.`,
      });
    } catch (error: any) {
      toast({
        title: "Error exportando reporte",
        description: error.response?.data?.message || error.message || "No se pudo descargar el Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchReport(initialFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto space-y-6 p-4 sm:p-6">
      <Card className="report-card">
        <CardHeader className="report-card-header space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Cake className="h-6 w-6 text-primary" />
                Reporte de Cumpleaños
              </CardTitle>
              <CardDescription>
                Consulta personas por mes de nacimiento y aplica filtros geográficos o de sexo.
              </CardDescription>
            </div>
            <ReportActions
              onClear={handleClear}
              onQuery={() => fetchReport()}
              onExport={handleExport}
              isLoading={isLoading}
              isExporting={isExporting}
              exportDisabled={personas.length === 0}
            />
          </div>
        </CardHeader>

        <CardContent className="report-card-content space-y-5">
          <div className="report-section-title rounded-xl bg-primary/[0.05] px-4 py-3">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Calendar className="h-4 w-4" />
              Filtro principal
            </div>
            <p className="text-sm text-muted-foreground">El mes de nacimiento es obligatorio para este reporte.</p>
          </div>

          <div className="report-filter-fields grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label>Mes de cumpleaños *</Label>
              <Select
                value={String(filters.mes_nacimiento)}
                onValueChange={(value) => updateFilter("mes_nacimiento", Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sexo</Label>
              <Autocomplete
                options={configData.sexoOptions}
                value={filters.id_sexo?.toString() || ""}
                onValueChange={(value) => updateFilter("id_sexo", toNumber(value))}
                placeholder="Seleccionar sexo..."
                searchPlaceholder="Buscar sexo..."
                emptyText="No se encontraron sexos"
                loading={configData.sexosLoading}
              />
            </div>
          </div>

          <div className="report-section-title rounded-xl bg-secondary/[0.05] px-4 py-3">
            <div className="flex items-center gap-2 font-semibold text-secondary-foreground">
              <MapPin className="h-4 w-4" />
              Ubicación
            </div>
            <p className="text-sm text-muted-foreground">Refina la consulta por municipio y sus dependencias.</p>
          </div>

          <div className="report-filter-fields grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2">
              <Label>Municipio</Label>
              <Autocomplete
                options={configData.municipioOptions}
                value={filters.id_municipio?.toString() || ""}
                onValueChange={updateMunicipio}
                placeholder="Seleccionar municipio..."
                searchPlaceholder="Buscar municipio..."
                emptyText="No se encontraron municipios"
                loading={configData.municipiosLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Parroquia</Label>
              <Autocomplete
                options={geoFilters.parroquiaOptions}
                value={filters.id_parroquia?.toString() || ""}
                onValueChange={(value) => updateFilter("id_parroquia", toNumber(value))}
                placeholder="Seleccionar parroquia..."
                searchPlaceholder="Buscar parroquia..."
                emptyText="No se encontraron parroquias"
                disabled={!filters.id_municipio}
                loading={geoFilters.isLoadingParroquias}
              />
            </div>

            <div className="space-y-2">
              <Label>Sector</Label>
              <Autocomplete
                options={geoFilters.sectorOptions}
                value={filters.id_sector?.toString() || ""}
                onValueChange={(value) => updateFilter("id_sector", toNumber(value))}
                placeholder="Seleccionar sector..."
                searchPlaceholder="Buscar sector..."
                emptyText="No se encontraron sectores"
                disabled={!filters.id_municipio}
                loading={geoFilters.isLoadingSectores}
              />
            </div>

            <div className="space-y-2">
              <Label>Vereda</Label>
              <Autocomplete
                options={geoFilters.veredaOptions}
                value={filters.id_vereda?.toString() || ""}
                onValueChange={(value) => updateFilter("id_vereda", toNumber(value))}
                placeholder="Seleccionar vereda..."
                searchPlaceholder="Buscar vereda..."
                emptyText="No se encontraron veredas"
                disabled={!filters.id_municipio}
                loading={geoFilters.isLoadingVeredas}
              />
            </div>

            <div className="space-y-2">
              <Label>Corregimiento</Label>
              <Autocomplete
                options={geoFilters.corregimientoOptions}
                value={filters.id_corregimiento?.toString() || ""}
                onValueChange={(value) => updateFilter("id_corregimiento", toNumber(value))}
                placeholder="Seleccionar corregimiento..."
                searchPlaceholder="Buscar corregimiento..."
                emptyText="No se encontraron corregimientos"
                disabled={!filters.id_municipio}
                loading={geoFilters.isLoadingCorregimientos}
              />
            </div>

            <div className="space-y-2">
              <Label>Centro poblado</Label>
              <Autocomplete
                options={geoFilters.centroPobladoOptions}
                value={filters.id_centro_poblado?.toString() || ""}
                onValueChange={(value) => updateFilter("id_centro_poblado", toNumber(value))}
                placeholder="Seleccionar centro poblado..."
                searchPlaceholder="Buscar centro poblado..."
                emptyText="No se encontraron centros poblados"
                disabled={!filters.id_municipio}
                loading={geoFilters.isLoadingCentrosPoblados}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <PersonasTable
        personas={personas}
        isLoading={isLoading}
        total={total}
        currentPage={filters.page || 1}
        pageSize={filters.limit || 100}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default BirthdayReport;
