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
    public void getWrite(@RequestParam(value = "code", required = false, defaultValue = "") String code,
                         Model model) {
        Board[] boards = articleService.getBoards();

        Board board = Arrays.stream(boards).filter(x -> x.getCode().equals(code)).findFirst().orElse(null);

        model.addAttribute("board", board);
    }

    @PostMapping("write")
    @ResponseBody
    public String postWrite(@RequestParam(value = "fileId", required = false) int[] fileIdArray,
                            @RequestParam(value = "imgId", required = false) int[] imgIdArray,
                            ArticleDto articleDto) {
        if (imgIdArray == null) {
            imgIdArray = new int[0];
        }

        if (fileIdArray == null) {
            fileIdArray = new int[0];
        }

        Long articleIndexInBoard = this.articleService.write(articleDto, fileIdArray, imgIdArray);

        JSONObject responseObject = new JSONObject();
        responseObject.put("index", articleIndexInBoard);

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
    public void getRead(@RequestParam(value = "index") Long index,
                        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                        @RequestParam(value = "criterion", required = false) String criterion,
                        @RequestParam(value = "keyword", required = false) String keyword,
                        @RequestParam(value = "code") String code,
                        Model model) {
        Board[] boards = this.articleService.getBoards();

        Article article = this.articleService.getArticle(index, code);

        Board board = Arrays.stream(boards)
                .filter(x -> x.getCode().equals(code))
                .findFirst()
                .orElse(null);
        List<File> fileList = this.articleService.getFileList(article.getId());

        model.addAttribute("fileList", fileList);
        model.addAttribute("board", board);
        model.addAttribute("page", page);
        model.addAttribute("criterion", criterion);
        model.addAttribute("keyword", keyword);
        model.addAttribute("article", article);

    }

    @GetMapping("modify")
    public void getModify(@RequestParam(value = "index") Long index,
                          @RequestParam(value = "code") String code,
                          Model model) {
        Board[] boards = this.articleService.getBoards();
        Article article = this.articleService.getArticle(index, code);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        String role = authentication.getAuthorities().toString();

        if (!article.getUser().getUsername().equals(username) && !role.equals("ROLE_ADMIN")) {
            article = null;
        } else {
            Board board = Arrays.stream(boards)
                    .filter(x -> x.getCode().equals(code))
                    .findFirst()
                    .orElse(null);

            List<File> fileList = this.articleService.getFileList(article.getId());
            model.addAttribute("board", board);
            model.addAttribute("fileList", fileList);
        }
        model.addAttribute("article", article);
    }

    @PostMapping("modify")
    @ResponseBody
    public String postModify(@RequestParam(value = "fileId", required = false) int[] fileIdArray,
                             @RequestParam(value = "imgId", required = false) int[] imgIdArray,
                             ArticleDto articleDto) {
        if (imgIdArray == null) {
            imgIdArray = new int[0];
        }

        if (fileIdArray == null) {
            fileIdArray = new int[0];
        }

        String result = this.articleService.modify(articleDto, fileIdArray, imgIdArray);

        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result);

        return responseObject.toString();
    }
}
