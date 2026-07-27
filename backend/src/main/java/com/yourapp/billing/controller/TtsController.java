package com.yourapp.billing.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/tts")
@CrossOrigin(origins = "*")
@Slf4j
public class TtsController {

    /**
     * Backend Proxy API phat truc tiep MP3 CHỊ GOOGLE NỮ 100% voi cau noi chi tiet day du
     */
    @GetMapping
    public ResponseEntity<byte[]> streamGoogleFemaleTts(@RequestParam("text") String text) {
        try {
            // Loc bo ky tu dac biet & giu nguyen tieng Viet
            String cleanText = text.replaceAll("[,!.]", " ").replaceAll("\\s+", " ").trim();
            if (cleanText.length() > 130) {
                cleanText = cleanText.substring(0, 130);
            }

            String encodedText = URLEncoder.encode(cleanText, StandardCharsets.UTF_8);
            String googleUrl = "https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=" + encodedText;

            URL url = new URI(googleUrl).toURL();
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36");
            conn.setRequestProperty("Referer", "https://translate.google.com/");
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);

            int responseCode = conn.getResponseCode();
            if (responseCode == 200) {
                try (InputStream in = conn.getInputStream();
                     ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                    byte[] buffer = new byte[4096];
                    int n;
                    while ((n = in.read(buffer)) != -1) {
                        out.write(buffer, 0, n);
                    }
                    byte[] mp3Bytes = out.toByteArray();

                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType("audio/mpeg"));
                    headers.setContentLength(mp3Bytes.length);
                    headers.setCacheControl("no-cache");

                    log.info("Backend TTS Proxy thanh cong cho cau doc: {}", cleanText);
                    return new ResponseEntity<>(mp3Bytes, headers, HttpStatus.OK);
                }
            } else {
                log.warn("Google TTS HTTP response code: {}", responseCode);
                return ResponseEntity.status(responseCode).build();
            }
        } catch (Exception e) {
            log.error("Loi Backend TTS Proxy: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
