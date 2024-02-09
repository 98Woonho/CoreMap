package com.coremap.demo.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.sql.Timestamp;

@Entity
@Data
public class Persistent_logins {
    @Id
    @Column(name="series",nullable = false,length=64)
    String series;
    String username;
    String token;
    Timestamp last_used;
}
