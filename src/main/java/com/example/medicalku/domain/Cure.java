package com.example.medicalku.domain;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class Cure {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "disease_id")
    private Disease disease;

    private String text;
}
