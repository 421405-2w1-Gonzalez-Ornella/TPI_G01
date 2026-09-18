import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CohortCardComponent } from './cohort-card.component';
import { CohorteDocente } from '../../../models/cohorte.model';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('CohortCardComponent', () => {
  const mockCohorteActiva: CohorteDocente = {
    id: 'c1',
    codigoComision: 'Programación IV — Comisión 4K1',
    materia: 'Ingeniería en Sistemas de Información',
    periodo: '2025-1C',
    estado: 'ACTIVE',
    alumnosMatriculados: 42,
    totalDesafios: 12,
    codigoInvitacion: 'UTN-FRC-4K1-2025',
    calibracionIAPendiente: false
  };

  const mockCohorteBorrador: CohorteDocente = {
    id: 'c2',
    codigoComision: 'Programación IV — Comisión 4K2',
    materia: 'Ingeniería en Sistemas de Información',
    periodo: '2025-2C',
    estado: 'DRAFT',
    alumnosMatriculados: 0,
    totalDesafios: 8,
    codigoInvitacion: 'PROG4-DRAFT-2025',
    calibracionIAPendiente: true
  };

  const mockCohorteArchivada: CohorteDocente = {
    id: 'c3',
    codigoComision: 'Programación IV — Comisión 4K3',
    materia: 'Ingeniería en Sistemas de Información',
    periodo: '2024-1C',
    estado: 'ARCHIVED',
    alumnosMatriculados: 35,
    totalDesafios: 10,
    codigoInvitacion: 'UTN-FRC-4K3-2024',
    calibracionIAPendiente: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CohortCardComponent]
    }).compileComponents();
  });

  function createComponent(cohorte: CohorteDocente): { fixture: ComponentFixture<CohortCardComponent>; component: CohortCardComponent } {
    const fixture = TestBed.createComponent(CohortCardComponent);
    const component = fixture.componentInstance;
    component.cohorte = cohorte;
    fixture.detectChanges();
    return { fixture, component };
  }

  it('debe crearse correctamente el componente', () => {
    const { component } = createComponent(mockCohorteActiva);
    expect(component).toBeTruthy();
  });

  describe('Renderizado de información base', () => {
    it('debe mostrar el código de comisión, materia y período', () => {
      const { fixture } = createComponent(mockCohorteActiva);
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('.course-code')?.textContent).toContain('Programación IV — Comisión 4K1');
      expect(compiled.querySelector('.course-name')?.textContent).toContain('Ingeniería en Sistemas de Información');
      expect(compiled.querySelector('.course-cohort')?.textContent).toContain('2025-1C');
    });

    it('debe mostrar el número de alumnos matriculados y el total de desafíos', () => {
      const { fixture } = createComponent(mockCohorteActiva);
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('.course-students-chip')?.textContent).toContain('42 Alumnos Matriculados');
      expect(compiled.querySelector('.course-meta')?.textContent).toContain('12 desafíos');
    });

    it('debe mostrar el código de invitación docente', () => {
      const { fixture } = createComponent(mockCohorteActiva);
      const compiled = fixture.nativeElement as HTMLElement;

      expect(compiled.querySelector('.code-text')?.textContent).toContain('UTN-FRC-4K1-2025');
    });
  });

  describe('Estados, semántica y accesibilidad (CA2 y notas)', () => {
    it('debe configurar correctamente el estado ACTIVO (ACTIVE)', () => {
      const { fixture, component } = createComponent(mockCohorteActiva);

      expect(component.estadoNormalizado).toBe('ACTIVE');
      expect(component.headerClass).toBe('a');
      expect(component.chipEstadoClass).toBe('chip-grn');
      expect(component.textoEstado).toBe('ACTIVO');
      expect(component.textoCiclo).toBe('Ciclo lectivo en curso');
      expect(component.ariaLabelTarjeta).toContain('Estado: ACTIVO');

      const badge = fixture.debugElement.query(By.css('.status-badge'));
      expect(badge.attributes['role']).toBe('status');
      expect(badge.attributes['aria-label']).toBe('Estado de cohorte: Activo, ciclo lectivo en curso');

      // Debe incluir el ícono semántico de check
      const statusIcon = badge.nativeElement.querySelector('.status-icon');
      expect(statusIcon).toBeTruthy();
      expect(statusIcon.innerHTML).toContain('M4.5 12.5');
    });

    it('debe configurar correctamente el estado BORRADOR (DRAFT)', () => {
      const { fixture, component } = createComponent(mockCohorteBorrador);

      expect(component.estadoNormalizado).toBe('DRAFT');
      expect(component.headerClass).toBe('b');
      expect(component.chipEstadoClass).toBe('chip-yel');
      expect(component.textoEstado).toBe('BORRADOR');
      expect(component.textoCiclo).toBe('En configuración');
      expect(component.ariaLabelTarjeta).toContain('Estado: BORRADOR');

      const badge = fixture.debugElement.query(By.css('.status-badge'));
      expect(badge.attributes['aria-label']).toBe('Estado de cohorte: Borrador, en configuración previa');

      // Debe incluir el ícono semántico de lápiz / edición
      const statusIcon = badge.nativeElement.querySelector('.status-icon');
      expect(statusIcon).toBeTruthy();
      expect(statusIcon.innerHTML).toContain('M12 20h9');
    });

    it('debe configurar correctamente el estado ARCHIVADO (ARCHIVED)', () => {
      const { fixture, component } = createComponent(mockCohorteArchivada);

      expect(component.estadoNormalizado).toBe('ARCHIVED');
      expect(component.headerClass).toBe('c');
      expect(component.chipEstadoClass).toBe('chip-vio');
      expect(component.textoEstado).toBe('ARCHIVADO');
      expect(component.textoCiclo).toBe('Cohorte archivada');
      expect(component.ariaLabelTarjeta).toContain('Estado: ARCHIVADO');

      const badge = fixture.debugElement.query(By.css('.status-badge'));
      expect(badge.attributes['aria-label']).toBe('Estado de cohorte: Archivado, ciclo concluido');

      // Debe incluir el ícono semántico de caja / archivo
      const statusIcon = badge.nativeElement.querySelector('.status-icon');
      expect(statusIcon).toBeTruthy();
      expect(statusIcon.innerHTML).toContain('polyline');
    });

    it('debe soportar estados en español legacy ("activo", "borrador", "archivado")', () => {
      const c1 = createComponent({ ...mockCohorteActiva, estado: 'activo' });
      expect(c1.component.estadoNormalizado).toBe('ACTIVE');

      const c2 = createComponent({ ...mockCohorteBorrador, estado: 'borrador' });
      expect(c2.component.estadoNormalizado).toBe('DRAFT');

      const c3 = createComponent({ ...mockCohorteArchivada, estado: 'archivado' });
      expect(c3.component.estadoNormalizado).toBe('ARCHIVED');
    });
  });

  describe('Navegación por teclado y accesibilidad (CA1)', () => {
    it('la tarjeta contenedor debe tener tabindex="0" y aria-label descriptivo', () => {
      const { fixture } = createComponent(mockCohorteActiva);
      const article = fixture.debugElement.query(By.css('article.course'));

      expect(article.attributes['tabindex']).toBe('0');
      expect(article.attributes['aria-label']).toContain('Cohorte Programación IV — Comisión 4K1');
    });

    it('los botones internos deben contar con etiquetas aria legibles', () => {
      const { fixture } = createComponent(mockCohorteActiva);
      const copyBtn = fixture.debugElement.query(By.css('.btn-copy'));
      const adminBtn = fixture.debugElement.query(By.css('.btn-admin-cohorte'));

      expect(copyBtn.attributes['aria-label']).toContain('Copiar código de invitación UTN-FRC-4K1-2025');
      expect(adminBtn.attributes['aria-label']).toContain('Administrar cohorte Programación IV — Comisión 4K1');
    });
  });

  describe('Calibración IA condicional', () => {
    it('debe ocultar el badge de calibración si calibracionIAPendiente es false', () => {
      const { fixture } = createComponent(mockCohorteActiva);
      const calibrationBadge = fixture.debugElement.query(By.css('.chip-calibration'));
      expect(calibrationBadge).toBeNull();
    });

    it('debe mostrar el badge de calibración si calibracionIAPendiente es true', () => {
      const { fixture } = createComponent(mockCohorteBorrador);
      const calibrationBadge = fixture.debugElement.query(By.css('.chip-calibration'));
      expect(calibrationBadge).not.toBeNull();
      expect(calibrationBadge.nativeElement.textContent).toContain('Calibración IA pendiente');
    });
  });

  describe('Emisión de eventos @Output()', () => {
    it('debe emitir copiarCodigo con el código de invitación al hacer click en Copiar', () => {
      const { fixture, component } = createComponent(mockCohorteActiva);
      let emittedCode = '';
      component.copiarCodigo.subscribe((code: string) => {
        emittedCode = code;
      });

      const copyBtn = fixture.debugElement.query(By.css('.btn-copy'));
      const event = new MouseEvent('click');
      event.stopPropagation = () => {};

      copyBtn.triggerEventHandler('click', event);
      expect(emittedCode).toBe('UTN-FRC-4K1-2025');
    });

    it('debe emitir administrar con el objeto cohorte al hacer click en Administrar Cohorte', () => {
      const { fixture, component } = createComponent(mockCohorteActiva);
      let emittedCohorte: CohorteDocente | null = null;
      component.administrar.subscribe((c: CohorteDocente) => {
        emittedCohorte = c;
      });

      const adminBtn = fixture.debugElement.query(By.css('.btn-admin-cohorte'));
      adminBtn.triggerEventHandler('click', null);

      expect(emittedCohorte).toEqual(mockCohorteActiva);
    });
  });
});
