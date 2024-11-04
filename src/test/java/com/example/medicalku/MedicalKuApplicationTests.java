package com.example.medicalku;

import com.example.medicalku.domain.Cure;
import com.example.medicalku.domain.Disease;
import com.example.medicalku.repository.DiseaseRepository;
import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

@SpringBootTest
@Log4j2
@Transactional
class MedicalKuApplicationTests {

    @Autowired
    DiseaseRepository diseaseRepository;

    @Test
    void contextLoads() {
        Optional<Disease> result = diseaseRepository.findByDiseaseName("아토피성 피부염");
        if(result.isPresent()) {
            List<Cure> cures = result.get().getCure();
            System.out.println("@@@@@@@@@"+cures.get(0).getText());
        }
    }

}
