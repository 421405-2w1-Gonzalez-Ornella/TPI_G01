import { describe, it, expect } from 'vitest';
import {
  normalizarEstadoCohorte,
  obtenerEtiquetaEstado,
  obtenerAriaLabelEstado,
  CohorteEstado
} from './cohorte.model';

describe('cohorte.model helpers', () => {
  describe('normalizarEstadoCohorte', () => {
    it('debe normalizar variantes activas a "ACTIVE"', () => {
      expect(normalizarEstadoCohorte('ACTIVE')).toBe('ACTIVE');
      expect(normalizarEstadoCohorte('activo')).toBe('ACTIVE');
      expect(normalizarEstadoCohorte('active' as CohorteEstado)).toBe('ACTIVE');
      expect(normalizarEstadoCohorte('ACTIVO' as CohorteEstado)).toBe('ACTIVE');
    });

    it('debe normalizar variantes borrador a "DRAFT"', () => {
      expect(normalizarEstadoCohorte('DRAFT')).toBe('DRAFT');
      expect(normalizarEstadoCohorte('borrador')).toBe('DRAFT');
      expect(normalizarEstadoCohorte('draft' as CohorteEstado)).toBe('DRAFT');
      expect(normalizarEstadoCohorte('BORRADOR' as CohorteEstado)).toBe('DRAFT');
    });

    it('debe normalizar variantes archivadas o desconocidas a "ARCHIVED"', () => {
      expect(normalizarEstadoCohorte('ARCHIVED')).toBe('ARCHIVED');
      expect(normalizarEstadoCohorte('archivado')).toBe('ARCHIVED');
      expect(normalizarEstadoCohorte('archived' as CohorteEstado)).toBe('ARCHIVED');
      expect(normalizarEstadoCohorte('otro' as CohorteEstado)).toBe('ARCHIVED');
      expect(normalizarEstadoCohorte('' as CohorteEstado)).toBe('ARCHIVED');
    });
  });

  describe('obtenerEtiquetaEstado', () => {
    it('debe retornar etiquetas en español en mayúsculas para la UI', () => {
      expect(obtenerEtiquetaEstado('ACTIVE')).toBe('ACTIVO');
      expect(obtenerEtiquetaEstado('activo')).toBe('ACTIVO');
      expect(obtenerEtiquetaEstado('DRAFT')).toBe('BORRADOR');
      expect(obtenerEtiquetaEstado('borrador')).toBe('BORRADOR');
      expect(obtenerEtiquetaEstado('ARCHIVED')).toBe('ARCHIVADO');
      expect(obtenerEtiquetaEstado('archivado')).toBe('ARCHIVADO');
    });
  });

  describe('obtenerAriaLabelEstado', () => {
    it('debe retornar descripciones semánticas accesibles para lectores de pantalla (CA2)', () => {
      expect(obtenerAriaLabelEstado('ACTIVE')).toBe('Estado de cohorte: Activo, ciclo lectivo en curso');
      expect(obtenerAriaLabelEstado('activo')).toBe('Estado de cohorte: Activo, ciclo lectivo en curso');
      expect(obtenerAriaLabelEstado('DRAFT')).toBe('Estado de cohorte: Borrador, en configuración previa');
      expect(obtenerAriaLabelEstado('borrador')).toBe('Estado de cohorte: Borrador, en configuración previa');
      expect(obtenerAriaLabelEstado('ARCHIVED')).toBe('Estado de cohorte: Archivado, ciclo concluido');
      expect(obtenerAriaLabelEstado('archivado')).toBe('Estado de cohorte: Archivado, ciclo concluido');
    });
  });
});
