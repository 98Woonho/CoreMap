package com.coremap.demo.domain.entity;

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
@Table(name="exercise")
public class Exercise {
    @Id
    private String name;
    private String nameKR;
    private String part;
    private String startPosition1;
    private String startPosition2;
    private String startPosition3;
    private String startPosition4;
    private String startPosition5;
    private String exerciseMovement1;
    private String exerciseMovement2;
    private String exerciseMovement3;
    private String exerciseMovement4;
    private String exerciseMovement5;
    private String breathTechnique;
    private String precaution1;
    private String precaution2;
    private String precaution3;
    private String precaution4;
    private String precaution5;
}
