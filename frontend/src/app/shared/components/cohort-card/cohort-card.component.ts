import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CohorteDocente,
  normalizarEstadoCohorte,
  obtenerEtiquetaEstado,
  obtenerAriaLabelEstado
} from '../../../models/cohorte.model';

@Component({
  selector: 'app-cohort-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cohort-card.component.html',
  styleUrl: './cohort-card.component.css'
})
export class CohortCardComponent {
  @Input({ required: true }) cohorte!: CohorteDocente;

  @Output() copiarCodigo = new EventEmitter<string>();
  @Output() administrar = new EventEmitter<CohorteDocente>();

  get estadoNormalizado(): 'ACTIVE' | 'DRAFT' | 'ARCHIVED' {
    return normalizarEstadoCohorte(this.cohorte.estado);
  }

  get headerClass(): string {
    switch (this.estadoNormalizado) {
      case 'ACTIVE':
        return 'a';
      case 'DRAFT':
        return 'b';
      case 'ARCHIVED':
        return 'c';
    }
  }

  get chipEstadoClass(): string {
    switch (this.estadoNormalizado) {
      case 'ACTIVE':
        return 'chip-grn';
      case 'DRAFT':
        return 'chip-yel';
      case 'ARCHIVED':
        return 'chip-vio';
    }
  }

  get textoEstado(): string {
    return obtenerEtiquetaEstado(this.cohorte.estado);
  }

  get ariaLabelEstado(): string {
    return obtenerAriaLabelEstado(this.cohorte.estado);
  }

  get textoCiclo(): string {
    switch (this.estadoNormalizado) {
      case 'ACTIVE':
        return 'Ciclo lectivo en curso';
      case 'DRAFT':
        return 'En configuración';
      case 'ARCHIVED':
        return 'Cohorte archivada';
    }
  }

  get ariaLabelTarjeta(): string {
    return `Cohorte ${this.cohorte?.codigoComision || ''}, Estado: ${this.textoEstado}`;
  }

  onCopiarCodigo(event: Event): void {
    event.stopPropagation();
    this.copiarCodigo.emit(this.cohorte.codigoInvitacion);
  }

  onAdministrar(): void {
    this.administrar.emit(this.cohorte);
  }
}
