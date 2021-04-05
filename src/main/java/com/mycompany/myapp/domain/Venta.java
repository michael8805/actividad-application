package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Venta.
 */
@Entity
@Table(name = "venta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Venta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "idventa")
    private Integer idventa;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "id_cliente")
    private Integer idCliente;

    @Column(name = "id_producto")
    private Integer idProducto;

    @OneToOne
    @JoinColumn(unique = true)
    private Cliente idCliente;

    @OneToOne
    @JoinColumn(unique = true)
    private Producto idProducto;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Venta id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getIdventa() {
        return this.idventa;
    }

    public Venta idventa(Integer idventa) {
        this.idventa = idventa;
        return this;
    }

    public void setIdventa(Integer idventa) {
        this.idventa = idventa;
    }

    public Integer getCantidad() {
        return this.cantidad;
    }

    public Venta cantidad(Integer cantidad) {
        this.cantidad = cantidad;
        return this;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public Integer getIdCliente() {
        return this.idCliente;
    }

    public Venta idCliente(Integer idCliente) {
        this.idCliente = idCliente;
        return this;
    }

    public void setIdCliente(Integer idCliente) {
        this.idCliente = idCliente;
    }

    public Integer getIdProducto() {
        return this.idProducto;
    }

    public Venta idProducto(Integer idProducto) {
        this.idProducto = idProducto;
        return this;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }

    public Cliente getIdCliente() {
        return this.idCliente;
    }

    public Venta idCliente(Cliente cliente) {
        this.setIdCliente(cliente);
        return this;
    }

    public void setIdCliente(Cliente cliente) {
        this.idCliente = cliente;
    }

    public Producto getIdProducto() {
        return this.idProducto;
    }

    public Venta idProducto(Producto producto) {
        this.setIdProducto(producto);
        return this;
    }

    public void setIdProducto(Producto producto) {
        this.idProducto = producto;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Venta)) {
            return false;
        }
        return id != null && id.equals(((Venta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Venta{" +
            "id=" + getId() +
            ", idventa=" + getIdventa() +
            ", cantidad=" + getCantidad() +
            ", idCliente=" + getIdCliente() +
            ", idProducto=" + getIdProducto() +
            "}";
    }
}
