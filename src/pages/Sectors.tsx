import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Users,
  Building,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Sectors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const sectors = [
    {
      id: 1,
      name: "La Esperanza",
      description: "Sector residencial norte",
      families: 156,
      completed: 142,
      pending: 14,
      coordinator: "María González",
      lastUpdate: "2024-07-10",
      status: "active"
    },
    {
      id: 2,
      name: "San José",
      description: "Zona centro-este",
      families: 98,
      completed: 89,
      pending: 9,
      coordinator: "Carlos Mendoza",
      lastUpdate: "2024-07-12",
      status: "active"
    },
    {
      id: 3,
      name: "Cristo Rey",
      description: "Sector sur de la parroquia",
      families: 134,
      completed: 120,
      pending: 14,
      coordinator: "Ana Rodríguez",
      lastUpdate: "2024-07-15",
      status: "active"
    },
    {
      id: 4,
      name: "Divino Niño",
      description: "Área oeste residencial",
      families: 87,
      completed: 75,
      pending: 12,
      coordinator: "Luis Herrera",
      lastUpdate: "2024-07-08",
      status: "active"
    },
    {
      id: 5,
      name: "Santa María",
      description: "Sector norte alto",
      families: 65,
      completed: 50,
      pending: 15,
      coordinator: "Carmen López",
      lastUpdate: "2024-07-14",
      status: "inactive"
    },
    {
      id: 6,
      name: "El Carmen",
      description: "Zona industrial sur",
      families: 42,
      completed: 38,
      pending: 4,
      coordinator: "Pedro Ramírez",
      lastUpdate: "2024-07-13",
      status: "active"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800">Activo</Badge>;
      case "inactive":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactivo</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  const filteredSectors = sectors.filter(sector => {
    const matchesSearch = sector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sector.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || sector.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalStats = {
    totalSectors: sectors.length,
    totalFamilies: sectors.reduce((sum, sector) => sum + sector.families, 0),
    totalCompleted: sectors.reduce((sum, sector) => sum + sector.completed, 0),
    activeSectors: sectors.filter(sector => sector.status === "active").length
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-green-600" />
            Gestión de Sectores
          </h1>
          <p className="text-gray-600">Administra los sectores parroquiales y sus coordinadores</p>
        </div>
        <Button onClick={() => navigate("/sectors/new")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Sector
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Sectores</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalSectors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Sectores Activos</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.activeSectors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Familias</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalFamilies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Encuestas Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalCompleted}</p>
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
                  placeholder="Buscar por nombre de sector o coordinador..."
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
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sectors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sectores Registrados</CardTitle>
          <CardDescription>
            Lista completa de sectores con información de progreso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sector</TableHead>
                <TableHead>Coordinador</TableHead>
                <TableHead>Familias</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSectors.map((sector) => (
                <TableRow key={sector.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sector.name}</p>
                      <p className="text-sm text-gray-500">{sector.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>{sector.coordinator}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sector.families}</p>
                      <p className="text-sm text-gray-500">
                        {sector.completed} completadas, {sector.pending} pendientes
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${getCompletionPercentage(sector.completed, sector.families)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {getCompletionPercentage(sector.completed, sector.families)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(sector.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {sector.lastUpdate}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/sectors/${sector.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/sectors/${sector.id}/edit`)}>
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

export default Sectors;
