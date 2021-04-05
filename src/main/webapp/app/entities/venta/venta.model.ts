import { ICliente } from 'app/entities/cliente/cliente.model';
import { IProducto } from 'app/entities/producto/producto.model';

export interface IVenta {
  id?: number;
  idventa?: number | null;
  cantidad?: number | null;
  idCliente?: number | null;
  idProducto?: number | null;
  idCliente?: ICliente | null;
  idProducto?: IProducto | null;
}

export class Venta implements IVenta {
  constructor(
    public id?: number,
    public idventa?: number | null,
    public cantidad?: number | null,
    public idCliente?: number | null,
    public idProducto?: number | null,
    public idCliente?: ICliente | null,
    public idProducto?: IProducto | null
  ) {}
}

export function getVentaIdentifier(venta: IVenta): number | undefined {
  return venta.id;
}
