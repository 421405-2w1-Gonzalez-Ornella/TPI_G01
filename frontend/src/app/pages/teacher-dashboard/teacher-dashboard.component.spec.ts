import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherDashboardComponent } from './teacher-dashboard.component';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('TeacherDashboardComponent', () => {
  let component: TeacherDashboardComponent;
  let fixture: ComponentFixture<TeacherDashboardComponent>;
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockRouter = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [TeacherDashboardComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse correctamente el TeacherDashboardComponent', () => {
    expect(component).toBeTruthy();
    expect(component.cohortes.length).toBe(3);
  });

  describe('Filtros por estado y búsqueda', () => {
    it('debe filtrar cohortes activas', () => {
      component.filtrar('activos');
      const filtradas = component.cohortesFiltradas();
      expect(filtradas.length).toBe(1);
      expect(filtradas[0].estado).toBe('activo');
    });

    it('debe filtrar cohortes en borrador', () => {
      component.filtrar('borradores');
      const filtradas = component.cohortesFiltradas();
      expect(filtradas.length).toBe(1);
      expect(filtradas[0].estado).toBe('borrador');
    });

    it('debe filtrar cohortes archivadas', () => {
      component.filtrar('archivados');
      const filtradas = component.cohortesFiltradas();
      expect(filtradas.length).toBe(1);
      expect(filtradas[0].estado).toBe('archivado');
    });

    it('debe mostrar todas las cohortes con el filtro "todos"', () => {
      component.filtrar('todos');
      const filtradas = component.cohortesFiltradas();
      expect(filtradas.length).toBe(3);
    });

    it('debe filtrar por término de búsqueda en código o materia', () => {
      component.busquedaCohorte = '4K2';
      const filtradas = component.cohortesFiltradas();
      expect(filtradas.length).toBe(1);
      expect(filtradas[0].codigoComision).toContain('4K2');
    });
  });

  describe('Navegación y controles de interfaz', () => {
    it('debe conmutar el modo oscuro', () => {
      const inicial = component.modoOscuro;
      component.toggleModoOscuro();
      expect(component.modoOscuro).toBe(!inicial);
    });

    it('debe redirigir al home de alumno al cambiarRol("alumno")', () => {
      component.cambiarRol('alumno');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('debe abrir y cerrar el modal de crear cohorte', () => {
      expect(component.modalCrearCohorteAbierto).toBe(false);
      component.abrirModalCrearCohorte();
      expect(component.modalCrearCohorteAbierto).toBe(true);
      component.cerrarModalCrearCohorte();
      expect(component.modalCrearCohorteAbierto).toBe(false);
    });

    it('debe abrir y cerrar el modal de crear plantilla', () => {
      expect(component.modalCrearPlantillaAbierto).toBe(false);
      component.abrirModalCrearPlantilla();
      expect(component.modalCrearPlantillaAbierto).toBe(true);
      component.cerrarModalCrearPlantilla();
      expect(component.modalCrearPlantillaAbierto).toBe(false);
    });

    it('debe alternar el menú desplegable de perfil docente y cerrarlo en document click', () => {
      const event = new MouseEvent('click');
      event.stopPropagation = vi.fn();

      expect(component.menuPerfilAbierto).toBe(false);
      component.toggleMenuPerfil(event);
      expect(component.menuPerfilAbierto).toBe(true);

      component.onDocumentClick();
      expect(component.menuPerfilAbierto).toBe(false);
    });

    it('debe copiar el código al portapapeles y mostrar alerta', () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      component.copiarCodigo('TEST-CODE-123');
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('TEST-CODE-123'));
    });

    it('debe guardar una nueva cohorte en borrador', () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      const inicialCount = component.cohortes.length;

      component.nuevoNombreComision = '4K9';
      component.nuevoCodigoCohorte = 'TEST-DRAFT-4K9';
      component.guardarCohorteDraft();

      expect(component.cohortes.length).toBe(inicialCount + 1);
      expect(component.cohortes[0].codigoComision).toContain('4K9');
      expect(component.modalCrearCohorteAbierto).toBe(false);
    });

    it('debe guardar plantilla y mostrar alerta', () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      component.guardarPlantilla();
      expect(component.modalCrearPlantillaAbierto).toBe(false);
      expect(window.alert).toHaveBeenCalled();
    });

    it('debe ejecutar onAdministrarCohorte y mostrar alerta', () => {
      vi.spyOn(window, 'alert').mockImplementation(() => {});
      component.onAdministrarCohorte(component.cohortes[0]);
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Administrando cohorte'));
    });
  });
});
