package com.example.medicalku.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
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


import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;


@org.springframework.stereotype.Controller
@RequestMapping("/medicalku")
@Log4j2
@RequiredArgsConstructor
public class Controller {

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

        // 파일 크기 확인
        long maxFileSize = 5 * 1024 * 1024; // 5 MB
        if (imageFile.getSize() > maxFileSize) {
            return redirectTo("/fail");
        }

        // 파일 형식 확인
        String contentType = imageFile.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return redirectTo("/fail");
        }

        // 메타데이터 로그
        System.out.println("File Name: " + filename);
        System.out.println("File Size: " + imageFile.getSize());
        System.out.println("Content Type: " + contentType);


        HttpClient client = HttpClient.newHttpClient();

        String url = "https://ad5e-35-196-81-74.ngrok-free.app/upload";

        String boundary = "----WebKitFormBoundary22OES6uBkBVZusVD";

        try {
            byte[] multipartBody = buildMultipartBody(imageFile, boundary); // 바이트 배열로 받기

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary) // 헤더 설정
                    .POST(HttpRequest.BodyPublishers.ofByteArray(multipartBody)) // Request Body를 바이트 배열로 설정
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // 응답 출력
            System.out.println("응답 코드: " + response.statusCode());
            System.out.println("응답 바디: " + response.body());

            if(response.statusCode() == 200){
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(response.body(), JsonObject.class);

                JsonArray predictionsArray = jsonObject.getAsJsonArray("top3_predictions");

                JsonArray prediction0 = predictionsArray.get(0).getAsJsonArray();

                redirectAttributes.addFlashAttribute("diseaseName", prediction0.get(0).getAsString());
                redirectAttributes.addFlashAttribute("probability", prediction0.get(1).getAsString());


                return redirectTo("/result");
            } else {
                return redirectTo("/fail");
            }

        } catch (Exception e) {
            return redirectTo("/fail");
        }

    }

    public ResponseEntity<String> redirectTo(String url) {
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create(url))
                .build();
    }

    private boolean allowedFileExtension(String filename) {
        String[] allowedExtensions = { "jpg", "jpeg", "png", "gif" };
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return Arrays.asList(allowedExtensions).contains(extension);
    }

    private byte[] buildMultipartBody(MultipartFile imageFile, String boundary) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        String lineSeparator = "\r\n";

        // 파트 시작 (파일 데이터)
        outputStream.write(("--" + boundary + lineSeparator).getBytes(StandardCharsets.UTF_8));
        outputStream.write(("Content-Disposition: form-data; name=\"file\"; filename=\""
                + imageFile.getOriginalFilename() + "\"" + lineSeparator).getBytes(StandardCharsets.UTF_8));
        outputStream.write(("Content-Type: " + imageFile.getContentType() + lineSeparator).getBytes(StandardCharsets.UTF_8));
        outputStream.write(lineSeparator.getBytes(StandardCharsets.UTF_8));

        // 파일 내용을 바이트 배열로 가져오기
        byte[] fileContent = imageFile.getBytes();
        outputStream.write(fileContent); // 바이트 배열을 그대로 추가

        outputStream.write(lineSeparator.getBytes(StandardCharsets.UTF_8));

        // 파트 종료
        outputStream.write(("--" + boundary + "--" + lineSeparator).getBytes(StandardCharsets.UTF_8));

        return outputStream.toByteArray(); // 결과를 바이트 배열로 반환
    }

}
