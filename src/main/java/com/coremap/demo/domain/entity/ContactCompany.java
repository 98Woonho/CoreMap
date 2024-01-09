package com.coremap.demo.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="contact_companies")
public class ContactCompany {
    @Id
    @Column(nullable = false, columnDefinition = "VARCHAR(5)")
    private String code;
    @Column(nullable = false, columnDefinition = "VARCHAR(10)")
    private String text;
}
