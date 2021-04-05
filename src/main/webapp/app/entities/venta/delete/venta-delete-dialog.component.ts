import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVenta } from '../venta.model';
import { VentaService } from '../service/venta.service';

@Component({
  templateUrl: './venta-delete-dialog.component.html',
})
export class VentaDeleteDialogComponent {
  venta?: IVenta;

  constructor(protected ventaService: VentaService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ventaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
