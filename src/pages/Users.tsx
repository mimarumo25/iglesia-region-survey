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
  UserCheck,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const users = [
    {
      id: 1,
      name: "María González",
      email: "maria.gonzalez@parroquia.com",
      phone: "+57 300 123 4567",
      role: "coordinator",
      sector: "La Esperanza",
      status: "active",
      lastLogin: "2024-07-15 09:30",
      surveysCompleted: 45,
      joinDate: "2024-01-15",
      avatar: null
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      email: "carlos.mendoza@parroquia.com",
      phone: "+57 300 234 5678",
      role: "surveyor",
      sector: "San José",
      status: "active",
      lastLogin: "2024-07-15 08:45",
      surveysCompleted: 32,
      joinDate: "2024-02-01",
      avatar: null
    },
    {
      id: 3,
      name: "Ana Rodríguez",
      email: "ana.rodriguez@parroquia.com",
      phone: "+57 300 345 6789",
      role: "coordinator",
      sector: "Cristo Rey",
      status: "active",
      lastLogin: "2024-07-14 16:20",
      surveysCompleted: 38,
      joinDate: "2024-01-20",
      avatar: null
    },
    {
      id: 4,
      name: "Luis Herrera",
      email: "luis.herrera@parroquia.com",
      phone: "+57 300 456 7890",
      role: "surveyor",
      sector: "Divino Niño",
      status: "active",
      lastLogin: "2024-07-13 14:15",
      surveysCompleted: 28,
      joinDate: "2024-03-01",
      avatar: null
    },
    {
      id: 5,
      name: "Carmen López",
      email: "carmen.lopez@parroquia.com",
      phone: "+57 300 567 8901",
      role: "admin",
      sector: "Todos",
      status: "active",
      lastLogin: "2024-07-15 10:00",
      surveysCompleted: 0,
      joinDate: "2024-01-01",
      avatar: null
    },
    {
      id: 6,
      name: "Pedro Ramírez",
      email: "pedro.ramirez@parroquia.com",
      phone: "+57 300 678 9012",
      role: "surveyor",
      sector: "El Carmen",
      status: "inactive",
      lastLogin: "2024-07-01 12:30",
      surveysCompleted: 15,
      joinDate: "2024-04-15",
      avatar: null
    },
    {
      id: 7,
      name: "Isabella Torres",
      email: "isabella.torres@parroquia.com",
      phone: "+57 300 789 0123",
      role: "surveyor",
      sector: "Santa María",
      status: "active",
      lastLogin: "2024-07-14 11:45",
      surveysCompleted: 22,
      joinDate: "2024-05-01",
      avatar: null
    }
  ];

  const roles = [
    { value: "all", label: "Todos los roles" },
    { value: "admin", label: "Administrador" },
    { value: "coordinator", label: "Coordinador" },
    { value: "surveyor", label: "Encuestador" }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default" className="bg-red-100 text-red-800">Administrador</Badge>;
      case "coordinator":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Coordinador</Badge>;
      case "surveyor":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Encuestador</Badge>;
      default:
        return <Badge variant="outline">Sin rol</Badge>;
    }
  };

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="w-4 h-4 text-red-600" />;
      case "coordinator":
        return <Shield className="w-4 h-4 text-blue-600" />;
      case "surveyor":
        return <UserCheck className="w-4 h-4 text-green-600" />;
      default:
        return <UserCheck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    admins: users.filter(u => u.role === "admin").length,
    coordinators: users.filter(u => u.role === "coordinator").length,
    surveyors: users.filter(u => u.role === "surveyor").length
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-blue-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600">Administra usuarios del sistema parroquial</p>
        </div>
        <Button onClick={() => navigate("/users/new")} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Activos</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Coordinadores</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.coordinators}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Encuestadores</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.surveyors}</p>
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
                  placeholder="Buscar por nombre, email o sector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
          <CardDescription>
            Lista completa de usuarios del sistema con sus roles y actividad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Encuestas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">Desde {user.joinDate}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      {getRoleBadge(user.role)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.sector}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-medium text-lg">{user.surveysCompleted}</p>
                      <p className="text-xs text-gray-500">completadas</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {user.lastLogin}
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
                        <DropdownMenuItem onClick={() => navigate(`/users/${user.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/users/${user.id}/edit`)}>
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

export default Users;
