import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  User,
  CheckCircle,
  Clock,
  XCircle,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Surveys = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  const surveys = [
    {
      id: 1,
      familyHead: "María González",
      sector: "La Esperanza",
      address: "Calle 15 #23-45",
      phone: "+57 300 123 4567",
      surveyor: "Carlos Mendoza",
      status: "completed",
      createdDate: "2024-07-15",
      completedDate: "2024-07-15",
      familySize: 4,
      housingType: "Casa propia"
    },
    {
      id: 2,
      familyHead: "José Ramírez",
      sector: "San José",
      address: "Carrera 8 #12-34",
      phone: "+57 300 234 5678",
      surveyor: "Ana Rodríguez",
      status: "pending",
      createdDate: "2024-07-14",
      completedDate: null,
      familySize: 3,
      housingType: "Apartamento arrendado"
    },
    {
      id: 3,
      familyHead: "Carmen López",
      sector: "Cristo Rey",
      address: "Avenida Principal #56-78",
      phone: "+57 300 345 6789",
      surveyor: "Luis Herrera",
      status: "completed",
      createdDate: "2024-07-13",
      completedDate: "2024-07-14",
      familySize: 5,
      housingType: "Casa familiar"
    },
    {
      id: 4,
      familyHead: "Pedro Martínez",
      sector: "Divino Niño",
      address: "Transversal 5 #89-12",
      phone: "+57 300 456 7890",
      surveyor: "María González",
      status: "in_progress",
      createdDate: "2024-07-12",
      completedDate: null,
      familySize: 2,
      housingType: "Apartamento propio"
    },
    {
      id: 5,
      familyHead: "Ana Torres",
      sector: "Santa María",
      address: "Diagonal 20 #34-56",
      phone: "+57 300 567 8901",
      surveyor: "Carmen López",
      status: "cancelled",
      createdDate: "2024-07-11",
      completedDate: null,
      familySize: 6,
      housingType: "Casa arrendada"
    },
    {
      id: 6,
      familyHead: "Roberto Silva",
      sector: "El Carmen",
      address: "Calle 30 #78-90",
      phone: "+57 300 678 9012",
      surveyor: "Pedro Ramírez",
      status: "completed",
      createdDate: "2024-07-10",
      completedDate: "2024-07-11",
      familySize: 3,
      housingType: "Casa propia"
    }
  ];

  const sectors = ["La Esperanza", "San José", "Cristo Rey", "Divino Niño", "Santa María", "El Carmen"];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completada
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            En Progreso
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.familyHead.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         survey.surveyor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || survey.status === statusFilter;
    const matchesSector = sectorFilter === "all" || survey.sector === sectorFilter;
    return matchesSearch && matchesStatus && matchesSector;
  });

  const surveyStats = {
    total: surveys.length,
    completed: surveys.filter(s => s.status === "completed").length,
    pending: surveys.filter(s => s.status === "pending").length,
    inProgress: surveys.filter(s => s.status === "in_progress").length,
    cancelled: surveys.filter(s => s.status === "cancelled").length
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Gestión de Encuestas
          </h1>
          <p className="text-gray-600">Administra todas las encuestas de caracterización familiar</p>
        </div>
        <Button onClick={() => navigate("/survey")} className="flex items-center gap-2 rounded-full p-4
        ">
          <Plus className="w-4 h-4" />
          Nueva Encuesta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{surveyStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{surveyStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{surveyStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{surveyStats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Canceladas</p>
                <p className="text-2xl font-bold text-gray-900">{surveyStats.cancelled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por familia, sector o encuestador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completadas</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="in_progress">En Progreso</SelectItem>
                  <SelectItem value="cancelled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Surveys Table */}
      <Card>
        <CardHeader>
          <CardTitle>Encuestas Registradas</CardTitle>
          <CardDescription>
            Lista completa de encuestas de caracterización familiar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Familia</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Encuestador</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Fecha Completada</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSurveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{survey.familyHead}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {survey.address}
                      </div>
                      <p className="text-sm text-gray-500">{survey.familySize} integrantes - {survey.housingType}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{survey.sector}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-gray-400" />
                      {survey.surveyor}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(survey.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {survey.createdDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    {survey.completedDate ? (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {survey.completedDate}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/surveys/${survey.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/surveys/${survey.id}/edit`)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default Surveys;
