import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CohorteDocente } from '../../models/cohorte.model';
import { CohortCardComponent } from '../../shared/components/cohort-card/cohort-card.component';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, CohortCardComponent],
  templateUrl: './teacher-dashboard.component.html',
  styleUrl: './teacher-dashboard.component.css'
})
export class TeacherDashboardComponent {
  // Datos del docente
  profesorNombre = 'Prof. Dr. Alejandro Rossi';
  profesorRol = 'DOCENTE TITULAR';
  institucion = 'UTN Facultad Regional Córdoba';
  modoOscuro = true; // Paleta de alumnos (oscura) por defecto

  // Menú de Perfil
  menuPerfilAbierto = false;

  // Filtros
  filtroCohorte: 'todos' | 'activos' | 'borradores' | 'archivados' = 'todos';
  busquedaCohorte = '';

  // Cohortes de cátedra
  cohortes: CohorteDocente[] = [
    {
      id: 'c1',
      codigoComision: 'Programación IV — Comisión 4K1',
      materia: 'Ingeniería en Sistemas de Información',
      periodo: '2025-1C',
      estado: 'activo',
      alumnosMatriculados: 42,
      totalDesafios: 12,
      codigoInvitacion: 'UTN-FRC-4K1-2025',
      calibracionIAPendiente: false
    },
    {
      id: 'c2',
      codigoComision: 'Programación IV — Comisión 4K2',
      materia: 'Ingeniería en Sistemas de Información',
      periodo: '2025-1C',
      estado: 'borrador',
      alumnosMatriculados: 0,
      totalDesafios: 12,
      codigoInvitacion: 'PROG4-DRAFT-2025',
      calibracionIAPendiente: true
    },
    {
      id: 'c3',
      codigoComision: 'Programación IV — Comisión 4K3',
      materia: 'Ingeniería en Sistemas de Información',
      periodo: '2024-1C',
      estado: 'archivado',
      alumnosMatriculados: 38,
      totalDesafios: 10,
      codigoInvitacion: 'UTN-FRC-4K3-2024',
      calibracionIAPendiente: false
    }
  ];

  // Modal para crear nueva cohorte
  modalCrearCohorteAbierto = false;
  pasoWizard = 1;
  nuevoNombreComision = '4K2';
  nuevoCodigoCohorte = 'XK7-M2A-2026';

  // Modal para crear plantilla
  modalCrearPlantillaAbierto = false;
  nuevaPlantillaNombre = '';
  nuevaPlantillaMateria = 'Programación IV';
  nuevaPlantillaDescripcion = '';

  constructor(private router: Router) {}

  cambiarRol(rol: string): void {
    if (rol === 'alumno') {
      this.router.navigate(['/home']);
    }
  }

  toggleModoOscuro(): void {
    this.modoOscuro = !this.modoOscuro;
  }

  filtrar(tipo: 'todos' | 'activos' | 'borradores' | 'archivados'): void {
    this.filtroCohorte = tipo;
  }

  cohortesFiltradas(): CohorteDocente[] {
    return this.cohortes.filter(c => {
      const coincideFiltro = this.filtroCohorte === 'todos' ||
                            (this.filtroCohorte === 'activos' && c.estado === 'activo') ||
                            (this.filtroCohorte === 'borradores' && c.estado === 'borrador') ||
                            (this.filtroCohorte === 'archivados' && c.estado === 'archivado');
      const coincideTexto = c.codigoComision.toLowerCase().includes(this.busquedaCohorte.toLowerCase()) ||
                            c.materia.toLowerCase().includes(this.busquedaCohorte.toLowerCase());
      return coincideFiltro && coincideTexto;
    });
  }

  copiarCodigo(cod: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cod);
    }
    alert(`Código [${cod}] copiado al portapapeles.`);
  }

  abrirModalCrearCohorte(): void {
    this.pasoWizard = 1;
    this.modalCrearCohorteAbierto = true;
  }

  cerrarModalCrearCohorte(): void {
    this.modalCrearCohorteAbierto = false;
  }

  guardarCohorteDraft(): void {
    const nueva: CohorteDocente = {
      id: 'c-' + Date.now(),
      codigoComision: `Programación IV — Comisión ${this.nuevoNombreComision}`,
      materia: 'Ingeniería en Sistemas de Información',
      periodo: '2025-2C',
      estado: 'borrador',
      alumnosMatriculados: 0,
      totalDesafios: 12,
      codigoInvitacion: this.nuevoCodigoCohorte,
      calibracionIAPendiente: true
    };
    this.cohortes.unshift(nueva);
    this.modalCrearCohorteAbierto = false;
    alert(`¡Cohorte ${this.nuevoNombreComision} creada en estado Borrador con código ${this.nuevoCodigoCohorte}!`);
  }

  abrirModalCrearPlantilla(): void {
    this.nuevaPlantillaNombre = 'Programación IV - Plan 2026';
    this.nuevaPlantillaMateria = 'Ingeniería en Sistemas de Información';
    this.nuevaPlantillaDescripcion = 'Definición curricular abstracta de arquitectura distribuida, microservicios y patrones backend.';
    this.modalCrearPlantillaAbierto = true;
  }

  cerrarModalCrearPlantilla(): void {
    this.modalCrearPlantillaAbierto = false;
  }

  guardarPlantilla(): void {
    this.modalCrearPlantillaAbierto = false;
    alert(`¡Plantilla "${this.nuevaPlantillaNombre}" creada con éxito!`);
  }

  onAdministrarCohorte(cohorte: CohorteDocente): void {
    alert(`Administrando cohorte: ${cohorte.codigoComision} (${cohorte.periodo})`);
  }

  // Métodos del Menú de Perfil Docente
  toggleMenuPerfil(event: MouseEvent): void {
    event.stopPropagation();
    this.menuPerfilAbierto = !this.menuPerfilAbierto;
  }

  cerrarMenuPerfil(): void {
    this.menuPerfilAbierto = false;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.menuPerfilAbierto = false;
  }
}
