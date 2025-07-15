import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  TrendingUp,
  FileText,
  Calendar,
  PieChart,
  Activity
} from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [reportType, setReportType] = useState("all");

  const reports = [
    {
      id: 1,
      title: "Reporte General de Encuestas",
      description: "Estadísticas completas de todas las encuestas realizadas",
      type: "general",
      period: "2024",
      generatedDate: "2024-07-15",
      records: 1247,
      format: "PDF",
      status: "completed"
    },
    {
      id: 2,
      title: "Análisis por Sectores",
      description: "Distribución y progreso por sector parroquial",
      type: "sectors",
      period: "Q2-2024",
      generatedDate: "2024-07-14",
      records: 6,
      format: "Excel",
      status: "completed"
    },
    {
      id: 3,
      title: "Reporte de Familias",
      description: "Caracterización demográfica de familias registradas",
      type: "families",
      period: "Julio-2024",
      generatedDate: "2024-07-13",
      records: 582,
      format: "PDF",
      status: "completed"
    },
    {
      id: 4,
      title: "Tipos de Vivienda",
      description: "Análisis de tipos de vivienda por sector",
      type: "housing",
      period: "2024",
      generatedDate: "2024-07-12",
      records: 1247,
      format: "Excel",
      status: "completed"
    },
    {
      id: 5,
      title: "Actividad de Usuarios",
      description: "Reporte de actividad y productividad de encuestadores",
      type: "users",
      period: "Junio-2024",
      generatedDate: "2024-07-10",
      records: 15,
      format: "PDF",
      status: "processing"
    },
    {
      id: 6,
      title: "Tendencias Mensuales",
      description: "Análisis de tendencias y patrones mensuales",
      type: "trends",
      period: "H1-2024",
      generatedDate: "2024-07-08",
      records: 6,
      format: "Excel",
      status: "completed"
    }
  ];

  const reportTypes = [
    { value: "all", label: "Todos los reportes" },
    { value: "general", label: "Reportes generales" },
    { value: "sectors", label: "Por sectores" },
    { value: "families", label: "De familias" },
    { value: "housing", label: "De vivienda" },
    { value: "users", label: "De usuarios" },
    { value: "trends", label: "De tendencias" }
  ];

  const periods = [
    { value: "all", label: "Todos los períodos" },
    { value: "2024", label: "Año 2024" },
    { value: "Q2-2024", label: "Q2 2024" },
    { value: "Julio-2024", label: "Julio 2024" },
    { value: "Junio-2024", label: "Junio 2024" },
    { value: "H1-2024", label: "Primer semestre 2024" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completado</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Procesando</Badge>;
      case "failed":
        return <Badge variant="destructive">Fallido</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "general":
        return <BarChart3 className="w-4 h-4" />;
      case "sectors":
        return <PieChart className="w-4 h-4" />;
      case "families":
        return <FileText className="w-4 h-4" />;
      case "housing":
        return <Activity className="w-4 h-4" />;
      case "users":
        return <Activity className="w-4 h-4" />;
      case "trends":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPeriod = periodFilter === "all" || report.period === periodFilter;
    const matchesType = reportType === "all" || report.type === reportType;
    return matchesSearch && matchesPeriod && matchesType;
  });

  const quickStats = [
    {
      title: "Total Reportes",
      value: reports.length,
      icon: FileText,
      color: "blue"
    },
    {
      title: "Reportes Completados",
      value: reports.filter(r => r.status === "completed").length,
      icon: BarChart3,
      color: "green"
    },
    {
      title: "En Procesamiento",
      value: reports.filter(r => r.status === "processing").length,
      icon: Activity,
      color: "yellow"
    },
    {
      title: "Total Registros",
      value: reports.reduce((sum, report) => sum + report.records, 0).toLocaleString(),
      icon: TrendingUp,
      color: "purple"
    }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Reportes y Estadísticas
          </h1>
          <p className="text-gray-600">Genera y consulta reportes del sistema parroquial</p>
        </div>
        <Button onClick={() => navigate("/reports/new")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Generar Nuevo Reporte
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar reportes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Disponibles</CardTitle>
          <CardDescription>
            Lista de reportes generados y disponibles para descarga
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reporte</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Generación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-gray-500">{report.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.period}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">{report.records.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.format === "PDF" ? "default" : "secondary"}>
                      {report.format}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {report.generatedDate}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {report.status === "completed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Lógica para descargar reporte
                            console.log("Descargando reporte:", report.id);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
