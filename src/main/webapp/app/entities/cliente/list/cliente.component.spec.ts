import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ClienteService } from '../service/cliente.service';

import { ClienteComponent } from './cliente.component';

describe('Component Tests', () => {
  describe('Cliente Management Component', () => {
    let comp: ClienteComponent;
    let fixture: ComponentFixture<ClienteComponent>;
    let service: ClienteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ClienteComponent],
      })
        .overrideTemplate(ClienteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ClienteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ClienteService);

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
      expect(comp.clientes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
