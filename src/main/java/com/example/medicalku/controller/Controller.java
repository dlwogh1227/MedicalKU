package com.example.medicalku.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@org.springframework.stereotype.Controller
@RequestMapping("/medicalku")
@Log4j2
@RequiredArgsConstructor
public class Controller {

    @GetMapping("/home")
    public void home(){

    }

    @PostMapping("/diagnosis")
    public ResponseEntity<String> uploadImage(@RequestParam("upfile") MultipartFile imageFile){
        if (imageFile.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        String uploadDir = "C:\\uploadImage\\"; // 업로드할 디렉토리
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs(); // 디렉토리가 없으면 생성
        }

        // 파일 저장
        try {
            String filePath = uploadDir + imageFile.getOriginalFilename();
            imageFile.transferTo(new File(filePath));
            return ResponseEntity.ok("Image uploaded successfully: " + filePath);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }
}
