import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Phone,
  Mail,
  MapPin,
  Home,
  Calendar,
  MoreHorizontal,
  User
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Families = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [housingFilter, setHousingFilter] = useState("all");

  const families = [
    {
      id: 1,
      familyName: "Palacios - González",
      fatherName: "Carlos Palacios",
      motherName: "María González",
      sector: "La Esperanza",
      address: "Calle 15 #23-45",
      phone: "+57 300 123 4567",
      email: "familia.palacios@email.com",
      familySize: 4,
      children: 2,
      housingType: "Casa propia",
      registrationDate: "2024-01-15",
      surveyStatus: "completed",
      lastUpdate: "2024-07-15"
    },
    {
      id: 2,
      familyName: "Ramírez - Morales",
      fatherName: "José Ramírez",
      motherName: "Ana Morales",
      sector: "San José",
      address: "Carrera 8 #12-34",
      phone: "+57 300 234 5678",
      email: "familia.ramirez@email.com",
      familySize: 3,
      children: 1,
      housingType: "Apartamento arrendado",
      registrationDate: "2024-02-20",
      surveyStatus: "pending",
      lastUpdate: "2024-07-14"
    },
    {
      id: 3,
      familyName: "López - Castillo",
      fatherName: "Luis López",
      motherName: "Carmen Castillo",
      sector: "Cristo Rey",
      address: "Avenida Principal #56-78",
      phone: "+57 300 345 6789",
      email: "familia.lopez@email.com",
      familySize: 5,
      children: 3,
      housingType: "Casa familiar",
      registrationDate: "2024-01-30",
      surveyStatus: "completed",
      lastUpdate: "2024-07-13"
    },
    {
      id: 4,
      familyName: "Martínez",
      fatherName: "Pedro Martínez",
      motherName: null,
      sector: "Divino Niño",
      address: "Transversal 5 #89-12",
      phone: "+57 300 456 7890",
      email: "pedro.martinez@email.com",
      familySize: 2,
      children: 1,
      housingType: "Apartamento propio",
      registrationDate: "2024-03-10",
      surveyStatus: "in_progress",
      lastUpdate: "2024-07-12"
    },
    {
      id: 5,
      familyName: "Torres - Vásquez",
      fatherName: "Roberto Torres",
      motherName: "Ana Vásquez",
      sector: "Santa María",
      address: "Diagonal 20 #34-56",
      phone: "+57 300 567 8901",
      email: "familia.torres@email.com",
      familySize: 6,
      children: 4,
      housingType: "Casa arrendada",
      registrationDate: "2024-02-05",
      surveyStatus: "completed",
      lastUpdate: "2024-07-11"
    },
    {
      id: 6,
      familyName: "Silva - Herrera",
      fatherName: "Roberto Silva",
      motherName: "Elena Herrera",
      sector: "El Carmen",
      address: "Calle 30 #78-90",
      phone: "+57 300 678 9012",
      email: "familia.silva@email.com",
      familySize: 3,
      children: 1,
      housingType: "Casa propia",
      registrationDate: "2024-04-01",
      surveyStatus: "completed",
      lastUpdate: "2024-07-10"
    }
  ];

  const sectors = ["La Esperanza", "San José", "Cristo Rey", "Divino Niño", "Santa María", "El Carmen"];
  const housingTypes = ["Casa propia", "Casa arrendada", "Apartamento propio", "Apartamento arrendado", "Casa familiar"];

  const getSurveyStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completada</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "in_progress":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En Progreso</Badge>;
      default:
        return <Badge variant="outline">Sin estado</Badge>;
    }
  };

  const getInitials = (familyName?: string) => {
    if (!familyName) return 'F'; // Familia por defecto
    
    // Obtener las primeras letras de los apellidos
    const parts = familyName.split(' - ');
    if (parts.length === 2) {
      return (parts[0]?.charAt(0) || '') + (parts[1]?.charAt(0) || '');
    }
    return familyName.split(' ')
      .filter(n => n.length > 0)
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'F';
  };

  const filteredFamilies = families.filter(family => {
    const matchesSearch = family.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         family.phone.includes(searchTerm) ||
                         (family.fatherName && family.fatherName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (family.motherName && family.motherName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = sectorFilter === "all" || family.sector === sectorFilter;
    const matchesHousing = housingFilter === "all" || family.housingType === housingFilter;
    return matchesSearch && matchesSector && matchesHousing;
  });

  const familyStats = {
    total: families.length,
    totalMembers: families.reduce((sum, family) => sum + family.familySize, 0),
    totalChildren: families.reduce((sum, family) => sum + family.children, 0),
    completedSurveys: families.filter(f => f.surveyStatus === "completed").length,
    pendingSurveys: families.filter(f => f.surveyStatus === "pending").length
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            Registro de Familias
          </h1>
          <p className="text-gray-600">Administra el registro completo de familias parroquiales</p>
        </div>
        <Button onClick={() => navigate("/survey")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Registrar Familia
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Familias</p>
                <p className="text-2xl font-bold text-gray-900">{familyStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Miembros</p>
                <p className="text-2xl font-bold text-gray-900">{familyStats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Niños</p>
                <p className="text-2xl font-bold text-gray-900">{familyStats.totalChildren}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Encuestas Completadas</p>
                <p className="text-2xl font-bold text-gray-900">{familyStats.completedSurveys}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{familyStats.pendingSurveys}</p>
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
                  placeholder="Buscar por apellidos, nombres, dirección o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los sectores</SelectItem>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={housingFilter} onValueChange={setHousingFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tipo de vivienda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {housingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Families Table */}
      <Card>
        <CardHeader>
          <CardTitle>Familias Registradas</CardTitle>
          <CardDescription>
            Lista completa de familias con información de contacto y estado de encuestas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Apellidos Familiares</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Composición</TableHead>
                <TableHead>Vivienda</TableHead>
                <TableHead>Estado Encuesta</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFamilies.map((family) => (
                <TableRow key={family.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={null} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-400 to-pink-500 text-white font-semibold">
                          {getInitials(family.familyName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-lg">Familia {family.familyName}</p>
                        <div className="text-sm text-gray-600 space-y-1">
                          {family.fatherName && (
                            <p className="flex items-center gap-1">
                              <span className="font-medium">Padre:</span> {family.fatherName}
                            </p>
                          )}
                          {family.motherName && (
                            <p className="flex items-center gap-1">
                              <span className="font-medium">Madre:</span> {family.motherName}
                            </p>
                          )}
                          {!family.motherName && (
                            <p className="text-gray-500 italic">Familia monoparental</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {family.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {family.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline">{family.sector}</Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {family.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium">{family.familySize} miembros</p>
                      <p className="text-sm text-gray-500">{family.children} niños</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Home className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{family.housingType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getSurveyStatusBadge(family.surveyStatus)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {family.lastUpdate}
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
                        <DropdownMenuItem onClick={() => navigate(`/families/${family.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/families/${family.id}/edit`)}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/surveys/new?family=${family.id}`)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Nueva Encuesta
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

export default Families;
