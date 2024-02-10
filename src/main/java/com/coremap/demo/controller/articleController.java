package com.coremap.demo.controller;

import com.coremap.demo.config.auth.PrincipalDetails;
import com.coremap.demo.domain.entity.Image;
import com.coremap.demo.domain.service.ArticleService;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@Controller
@Slf4j
@RequestMapping("article")
public class articleController {
    @Autowired
    private ArticleService articleService;


    @GetMapping("write")
    public void getWrite() {}

    @RequestMapping(value = "image",
            method = RequestMethod.GET)
    public ResponseEntity<byte[]> getImage(@RequestParam(value = "id") Long id) {
        ResponseEntity<byte[]> response;
        Image image = this.articleService.getImage(id);
        if (image == null) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            // 이미지 데이터를 HTTP 응답으로 전송하는 부분
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(image.getType()));
            headers.setContentLength(image.getSize());
            response = new ResponseEntity<>(image.getData(), headers, HttpStatus.OK);
        }
        return response;
    }

    @RequestMapping(value = "image",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postImage(@RequestParam(value = "upload") MultipartFile file,
                            Authentication authentication) throws IOException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        String username = principalDetails.getUserDto().getUsername();
        Image image = new Image(file);
        String result = this.articleService.uploadImage(image, username);

        JSONObject responseObject = new JSONObject();
        if (Objects.equals(result, "SUCCESS")) {
            responseObject.put("url", "/article/image?id=" + image.getId());
        } else {
            JSONObject messageObject = new JSONObject();
            messageObject.put("message", "이미지를 업로드하지 못하였습니다.");
            responseObject.put("error", messageObject);
        }
        return responseObject.toString();
    }
}
