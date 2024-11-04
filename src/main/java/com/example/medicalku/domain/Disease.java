package com.example.medicalku.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Getter
public class Disease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 30, nullable = false)
    private String diseaseName;

    @Column(length = 50, nullable = false)
    private String risk;

    @Column(length = 200, nullable = false)
    private String cause;

    @Column(length = 200, nullable = false)
    private String description;

    @OneToMany(mappedBy = "disease", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Diagnosis> diagnosis = new ArrayList<>();

    @OneToMany(mappedBy = "disease", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Cure> cure = new ArrayList<>();

    @Column(length = 200, nullable = false)
    private String imagePath;

}
