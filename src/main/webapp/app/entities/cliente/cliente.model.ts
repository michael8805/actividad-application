export interface ICliente {
  id?: number;
  idcliente?: number | null;
  nombre?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  ciudad?: string | null;
}

export class Cliente implements ICliente {
  constructor(
    public id?: number,
    public idcliente?: number | null,
    public nombre?: string | null,
    public direccion?: string | null,
    public telefono?: string | null,
    public ciudad?: string | null
  ) {}
}

export function getClienteIdentifier(cliente: ICliente): number | undefined {
  return cliente.id;
}
