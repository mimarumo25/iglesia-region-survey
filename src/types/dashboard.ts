// Interfaces for Dashboard components

export interface StatsData {
  totalEncuestas: number;
  completadas: number;
  pendientes: number;
  sectores: number;
}

export interface SectorData {
  name: string;
  families: number;
  completed: number;
}

export interface ActivityData {
  id: number;
  type: string;
  user: string;
  sector: string;
  time: string;
}

export interface HousingData {
  type: string;
  count: number;
  percentage: number;
}
