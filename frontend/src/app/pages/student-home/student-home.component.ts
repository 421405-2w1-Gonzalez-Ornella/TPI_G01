import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CursoEstudiante {
  id: string;
  codigoComision: string;
  materia: string;
  profesor: string;
  posicionRanking: number;
  vidasActuales: number;
  vidasMaximas: number;
  monedas: number;
  xp: number;
  progresoPorcentaje: number;
}

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.css'
})
export class StudentHomeComponent {
  // Datos del alumno autenticado
  estudianteNombre = 'Mateo Francisco Rossi';
  estudianteRol = 'ALUMNO';
  legajo = '82245';
  emailInstitucional = 'mateo.rossi@frc.utn.edu.ar';
  carrera = 'Tecnicatura Universitaria en Programación';

  // Control del Menú Desplegable de Perfil
  menuPerfilAbierto = false;

  // Filtros
  filtroActual: 'todos' | 'activos' | 'pendientes' = 'todos';
  busquedaQuery = '';

  // Cursos matriculados
  cursos: CursoEstudiante[] = [
    {
      id: 'prog4-4k1',
      codigoComision: 'COMISIÓN 4K1',
      materia: 'Programación IV',
      profesor: 'Prof. Dr. Alejandro Rossi',
      posicionRanking: 7,
      vidasActuales: 3,
      vidasMaximas: 3,
      monedas: 450,
      xp: 1450,
      progresoPorcentaje: 65
    },
    {
      id: 'bdd-4k2',
      codigoComision: 'COMISIÓN 4K2',
      materia: 'Bases de Datos',
      profesor: 'Prof. Ing. Carina Valdez',
      posicionRanking: 12,
      vidasActuales: 2,
      vidasMaximas: 3,
      monedas: 280,
      xp: 1200,
      progresoPorcentaje: 40
    }
  ];

  // Solicitudes pendientes
  solicitudesPendientes = [
    {
      cohorte: 'Soporte Físico y Redes — Comisión 4K2',
      fecha: '15/09/2026',
      estado: 'Pendiente de revisión docente por inscripción en período especial'
    }
  ];

  constructor(private router: Router) {}

  cambiarRol(rol: string): void {
    if (rol === 'profesor') {
      this.router.navigate(['/profesor']);
    }
  }

  filtrar(tipo: 'todos' | 'activos' | 'pendientes'): void {
    this.filtroActual = tipo;
  }

  cursosFiltrados(): CursoEstudiante[] {
    return this.cursos.filter(c => {
      const coincideBusqueda = c.materia.toLowerCase().includes(this.busquedaQuery.toLowerCase()) ||
                               c.codigoComision.toLowerCase().includes(this.busquedaQuery.toLowerCase());
      return coincideBusqueda;
    });
  }

  // Métodos del Menú de Perfil
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
