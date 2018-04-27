package com.fantosoft.roombooking.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A Pricing.
 */
@Entity
@Table(name = "pricing")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Pricing implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "price_guest", precision=10, scale=2)
    private BigDecimal priceGuest;

    @OneToOne
    @JoinColumn(unique = true)
    private RoomCategory pricing;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPriceGuest() {
        return priceGuest;
    }

    public Pricing priceGuest(BigDecimal priceGuest) {
        this.priceGuest = priceGuest;
        return this;
    }

    public void setPriceGuest(BigDecimal priceGuest) {
        this.priceGuest = priceGuest;
    }

    public RoomCategory getPricing() {
        return pricing;
    }

    public Pricing pricing(RoomCategory roomCategory) {
        this.pricing = roomCategory;
        return this;
    }

    public void setPricing(RoomCategory roomCategory) {
        this.pricing = roomCategory;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Pricing pricing = (Pricing) o;
        if (pricing.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), pricing.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Pricing{" +
            "id=" + getId() +
            ", priceGuest=" + getPriceGuest() +
            "}";
    }
}
