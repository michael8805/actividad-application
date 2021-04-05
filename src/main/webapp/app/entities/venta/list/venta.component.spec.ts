import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VentaService } from '../service/venta.service';

import { VentaComponent } from './venta.component';

describe('Component Tests', () => {
  describe('Venta Management Component', () => {
    let comp: VentaComponent;
    let fixture: ComponentFixture<VentaComponent>;
    let service: VentaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VentaComponent],
      })
        .overrideTemplate(VentaComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VentaComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VentaService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.ventas?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
