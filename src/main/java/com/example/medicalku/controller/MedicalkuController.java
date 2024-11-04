package com.example.medicalku.controller;

import com.example.medicalku.domain.Disease;
import com.example.medicalku.repository.DiseaseRepository;
import com.example.medicalku.service.AiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.net.URI;
import java.util.Arrays;
import java.util.Optional;


@org.springframework.stereotype.Controller
@RequestMapping("/medicalku")
@Log4j2
@RequiredArgsConstructor
public class MedicalkuController {

    AiService aiService;
    DiseaseRepository diseaseRepository;

    @GetMapping("/home")
    public void home(){

    }

    @PostMapping("/diagnosis")
    public ResponseEntity<String> uploadImage(@RequestParam("upfile") MultipartFile imageFile, RedirectAttributes redirectAttributes){
        if (imageFile.isEmpty()) {
            return redirectTo("/fail");
        }

        String filename = imageFile.getOriginalFilename();
        if (filename == null || !allowedFileExtension(filename)) {
            return redirectTo("/fail");
        }

        // 파일 형식 확인
        String contentType = imageFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return redirectTo("/fail");
        }

        // 메타데이터 로그
        log.info("File Name: {}", filename);
        log.info("File Size: {}", imageFile.getSize());
        log.info("Content Type: {}", contentType);

        String[][] result = aiService.reqToAi(imageFile);

        if(result == null){
            return redirectTo("/fail");
        } else {
            Optional<Disease> predict1 = diseaseRepository.findByDiseaseName(result[0][0]);
            if(predict1.isEmpty()){
                log.error("데이터베이스에서 1번째 disease 불러오기 실패@@@@@");
            } else {
                redirectAttributes.addFlashAttribute("diseaseName1", result[0][0]);
                redirectAttributes.addFlashAttribute("probability1", result[0][1]);
                redirectAttributes.addFlashAttribute("risk1", predict1.get().getRisk());
                redirectAttributes.addFlashAttribute("description1", predict1.get().getDescription());
                redirectAttributes.addFlashAttribute("diagnosis1", predict1.get().getDiagnosis());
                redirectAttributes.addFlashAttribute("cure1", predict1.get().getCure());
                redirectAttributes.addFlashAttribute("imagePath1", predict1.get().getImagePath());
            }


            if(Double.parseDouble(result[1][1]) > 0.1){
                Optional<Disease> predict2 = diseaseRepository.findByDiseaseName(result[1][0]);
                if(predict2.isEmpty()){
                    log.error("데이터베이스에서 2번째 disease 불러오기 실패@@@@@");
                } else {
                    redirectAttributes.addFlashAttribute("diseaseName2", result[1][0]);
                    redirectAttributes.addFlashAttribute("probability2", result[1][1]);
                    redirectAttributes.addFlashAttribute("risk2", predict2.get().getRisk());
                    redirectAttributes.addFlashAttribute("description2", predict2.get().getDescription());
                    redirectAttributes.addFlashAttribute("diagnosis2", predict2.get().getDiagnosis());
                    redirectAttributes.addFlashAttribute("cure2", predict2.get().getCure());
                    redirectAttributes.addFlashAttribute("imagePath2", predict2.get().getImagePath());
                }

                if(Double.parseDouble(result[2][1]) > 0.1){
                    Optional<Disease> predict3 = diseaseRepository.findByDiseaseName(result[2][0]);
                    if(predict3.isEmpty()){
                        log.error("데이터베이스에서 3번째 disease 불러오기 실패@@@@@");
                    } else {
                        redirectAttributes.addFlashAttribute("diseaseName3", result[2][0]);
                        redirectAttributes.addFlashAttribute("probability3", result[2][1]);
                        redirectAttributes.addFlashAttribute("risk3", predict3.get().getRisk());
                        redirectAttributes.addFlashAttribute("description3", predict3.get().getDescription());
                        redirectAttributes.addFlashAttribute("diagnosis3", predict3.get().getDiagnosis());
                        redirectAttributes.addFlashAttribute("cure3", predict3.get().getCure());
                        redirectAttributes.addFlashAttribute("imagePath3", predict3.get().getImagePath());
                    }
                }
            }
            return redirectTo("/result");
        }
    }

    public ResponseEntity<String> redirectTo(String url) {
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(url))
                .build();
    }

    private boolean allowedFileExtension(String filename) {
        String[] allowedExtensions = { "jpg", "jpeg", "png" };
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return Arrays.asList(allowedExtensions).contains(extension);
    }

}
