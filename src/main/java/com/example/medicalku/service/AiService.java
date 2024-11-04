package com.example.medicalku.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
@Log4j2
public class AiService {

    @Value("${ai.server.url}")
    private String url;

    public String[][] reqToAi(MultipartFile imageFile){

        HttpClient client = HttpClient.newHttpClient();
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
            log.info("응답 코드: {}", response.statusCode());
            log.info("응답 바디: {}", response.body());

            if(response.statusCode() == 200){
                Gson gson = new Gson();
                JsonObject jsonObject = gson.fromJson(response.body(), JsonObject.class);

                JsonArray predictionsArray = jsonObject.getAsJsonArray("top3_predictions");

                JsonArray prediction0 = predictionsArray.get(0).getAsJsonArray();
                JsonArray prediction1 = predictionsArray.get(1).getAsJsonArray();
                JsonArray prediction2 = predictionsArray.get(2).getAsJsonArray();

                String[][] result = {
                        {prediction0.get(0).getAsString(), prediction0.get(1).getAsString()},
                        {prediction1.get(0).getAsString(), prediction1.get(1).getAsString()},
                        {prediction2.get(0).getAsString(), prediction2.get(1).getAsString()}
                };

                return result;
            } else {
                return null;
            }

        } catch (Exception e) {
            return null;
        }

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
