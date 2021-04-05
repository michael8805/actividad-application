export interface IProducto {
  id?: number;
  idproducto?: number | null;
  descripcion?: string | null;
  precio?: number | null;
}

export class Producto implements IProducto {
  constructor(public id?: number, public idproducto?: number | null, public descripcion?: string | null, public precio?: number | null) {}
}

export function getProductoIdentifier(producto: IProducto): number | undefined {
  return producto.id;
}
