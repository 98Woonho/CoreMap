package com.coremap.demo.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Signature {
    @Id
    @Column(name="signature", nullable = false, length=3072)
    private byte[] keybyte;
    private LocalDate date;
}
