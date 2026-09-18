export type CohorteEstado = 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'activo' | 'borrador' | 'archivado';

export interface CohorteDocente {
  id: string;
  codigoComision: string;
  materia: string;
  periodo: string;
  estado: CohorteEstado;
  alumnosMatriculados: number;
  totalDesafios: number;
  codigoInvitacion: string;
  calibracionIAPendiente: boolean;
}

/**
 * Normaliza cualquier formato de estado a los valores estándar de la US ('ACTIVE', 'DRAFT', 'ARCHIVED')
 */
export function normalizarEstadoCohorte(estado: CohorteEstado): 'ACTIVE' | 'DRAFT' | 'ARCHIVED' {
  const norm = (estado || '').toLowerCase();
  if (norm === 'activo' || norm === 'active') {
    return 'ACTIVE';
  }
  if (norm === 'borrador' || norm === 'draft') {
    return 'DRAFT';
  }
  return 'ARCHIVED';
}

/**
 * Retorna la etiqueta legible en español para la interfaz
 */
export function obtenerEtiquetaEstado(estado: CohorteEstado): string {
  const norm = normalizarEstadoCohorte(estado);
  switch (norm) {
    case 'ACTIVE':
      return 'ACTIVO';
    case 'DRAFT':
      return 'BORRADOR';
    case 'ARCHIVED':
      return 'ARCHIVADO';
  }
}

/**
 * Retorna la descripción accesible (aria-label) para lectores de pantalla
 */
export function obtenerAriaLabelEstado(estado: CohorteEstado): string {
  const norm = normalizarEstadoCohorte(estado);
  switch (norm) {
    case 'ACTIVE':
      return 'Estado de cohorte: Activo, ciclo lectivo en curso';
    case 'DRAFT':
      return 'Estado de cohorte: Borrador, en configuración previa';
    case 'ARCHIVED':
      return 'Estado de cohorte: Archivado, ciclo concluido';
  }
}
