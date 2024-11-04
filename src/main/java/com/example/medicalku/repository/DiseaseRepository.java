package com.example.medicalku.repository;

import com.example.medicalku.domain.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DiseaseRepository extends JpaRepository<Disease, Integer> {

    @Query("SELECT d FROM Disease d WHERE d.diseaseName = :diseaseName")
    Optional<Disease> findByDiseaseName(@Param("diseaseName") String diseaseName);
}
