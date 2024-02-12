package com.coremap.demo.controller;

import com.coremap.demo.domain.dto.ArticleDto;
import com.coremap.demo.domain.dto.FileDto;
import com.coremap.demo.domain.dto.ImageDto;
import com.coremap.demo.domain.entity.Article;
import com.coremap.demo.domain.entity.Board;
import com.coremap.demo.domain.entity.File;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Controller
@Slf4j
@RequestMapping("article")
public class ArticleController {
    @Autowired
    private ArticleService articleService;


    @GetMapping("write")
    public void getWrite(@RequestAttribute(value = "boards") Board[] boards,
                         @RequestParam(value = "code", required = false, defaultValue = "") String code,
                         Model model) {

    }

    @PostMapping("write")
    @ResponseBody
    public String postWrite(@RequestParam(value = "fileId", required = false) int[] fileIdArray,
                            @RequestParam(value =  "imgId", required = false) int[] imgIdArray,
                            ArticleDto articleDto) {
        if (imgIdArray == null) {
            imgIdArray = new int[0];
        }

        if (fileIdArray == null) {
            fileIdArray = new int[0];
        }

        Long articleId = this.articleService.write(articleDto, fileIdArray, imgIdArray);

        JSONObject responseObject = new JSONObject();
        responseObject.put("id", articleId);

        return responseObject.toString();
    }

    @GetMapping("image")
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

    @PostMapping("image")
    @ResponseBody
    public String postImage(@RequestParam(value = "upload") MultipartFile file) throws IOException {
        ImageDto imageDto = new ImageDto(file);
        Image image = this.articleService.uploadImage(imageDto);

        JSONObject responseObject = new JSONObject();
        responseObject.put("url", "/article/image?id=" + image.getId());

        return responseObject.toString();
    }

    @PostMapping("file")
    @ResponseBody
    public String postFile(@RequestParam(value = "file") MultipartFile mulitpartFile) throws IOException {
        FileDto fileDto = new FileDto(mulitpartFile);
        File file = this.articleService.uploadFile(fileDto);
        JSONObject responseObject = new JSONObject();
        responseObject.put("id", file.getId());

        return responseObject.toString();
    }

    @GetMapping("read")
    public void getRead(@RequestParam(value = "id") Long id,
                        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                        @RequestAttribute(value = "boards") Board[] boards,
                        Model model) {
        Article article = this.articleService.getArticle(id);

        if (article != null && !article.isDeleted()) {
            Board board = Arrays.stream(boards)
                    .filter(x -> x.getCode().equals(article.getBoard().getCode()))
                    .findFirst()
                    .orElse(null);
            List<File> fileList = this.articleService.getFileList(id);
            model.addAttribute("fileList", fileList);
            model.addAttribute("board", board);
            model.addAttribute("page", page);
        }
        model.addAttribute("article", article);
    }
}
