package com.coremap.demo.controller;

import com.coremap.demo.domain.dto.*;
import com.coremap.demo.domain.entity.*;
import com.coremap.demo.domain.service.ArticleService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

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

    @GetMapping("file")
    public ResponseEntity<byte[]> getFile(@RequestParam(value = "id") Long id) {
        ResponseEntity<byte[]> response;
        File file = this.articleService.getFile(id);
        if (file == null) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            /**
             * [공부] ContentDisposition : 파일 다운로드를 할 때 사용되어 웹 서버가 전송한 파일이 브라우저에서 어떻게 처리되어야 하는지를 지정
             * attachment() : 파일을 다운로드로 받음.
             * inline() : 파일이 다운로드되지 않고 웹으로 표시 해줌.
             * filename() : 다운로드 받은 파일 이름
             */
            ContentDisposition contentDisposition = ContentDisposition
                    .attachment()
                    .filename(file.getName(), StandardCharsets.UTF_8)
                    .build();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(file.getType()));
            headers.setContentLength(file.getSize());
            headers.setContentDisposition(contentDisposition);
            response = new ResponseEntity<>(file.getData(), headers, HttpStatus.OK);
        }
        return response;
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
        Board[] boards = articleService.getBoards();

        Article article = articleService.getArticle(index, code);

        List<Comment> commentList = articleService.getCommentList(article.getId());

        List<SubComment> subCommentList = articleService.getSubCommentList(article.getId());

        List<CommentLike> commentLikeList = articleService.getCommentLikeList(article.getId());

        List<Map<String, Object>> commentLikeCountList = new ArrayList<>();
        List<Long> existingCommentIdList = new ArrayList<>();

        for(CommentLike commentLike : commentLikeList) {
            Long commentId = commentLike.getComment().getId();

            if (existingCommentIdList.contains(commentId)) {
                continue;
            }

            int likeCount = articleService.getLikeCount(commentLike.getComment().getId(), true);
            int dislikeCount = articleService.getDislikeCount(commentLike.getComment().getId(), false);

            Map<String, Object> commentLikeCount = new HashMap<>();

            commentLikeCount.put("commentId", commentLike.getComment().getId());
            commentLikeCount.put("likeCount", likeCount);
            commentLikeCount.put("dislikeCount", dislikeCount);
            commentLikeCountList.add(commentLikeCount);
            existingCommentIdList.add(commentId);
        }

        List<SubCommentLike> subCommentLikeList = articleService.getSubCommentLikeList(article.getId());

        List<Map<String, Object>> subCommentLikeCountList = new ArrayList<>();
        List<Long> existingSubCommentIdList = new ArrayList<>();

        for(SubCommentLike subCommentLike : subCommentLikeList) {
            Long subCommentId = subCommentLike.getSubComment().getId();

            if (existingSubCommentIdList.contains(subCommentId)) {
                continue;
            }

            int likeCount = articleService.getSubCommentLikeCount(subCommentLike.getSubComment().getId(), true);
            int dislikeCount = articleService.getSubCommentDislikeCount(subCommentLike.getSubComment().getId(), false);

            Map<String, Object> subCommentLikeCount = new HashMap<>();

            subCommentLikeCount.put("subCommentId", subCommentLike.getSubComment().getId());
            subCommentLikeCount.put("likeCount", likeCount);
            subCommentLikeCount.put("dislikeCount", dislikeCount);
            subCommentLikeCountList.add(subCommentLikeCount);
            existingSubCommentIdList.add(subCommentId);
        }

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
        model.addAttribute("commentList", commentList);
        model.addAttribute("subCommentList", subCommentList);
        model.addAttribute("commentLikeList", commentLikeList);
        model.addAttribute("commentLikeCountList", commentLikeCountList);
        model.addAttribute("subCommentLikeList", subCommentLikeList);
        model.addAttribute("subCommentLikeCountList", subCommentLikeCountList);
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

        return articleService.modify(articleDto, fileIdArray, imgIdArray);
    }

    @DeleteMapping("delete")
    @ResponseBody
    public String deleteArticle(@RequestParam(value = "id") Long id ,
                                Model model) {
        return articleService.delete(id);
    }

    @PostMapping("comment")
    @ResponseBody
    public String postComment(CommentDto commentDto) {
        return articleService.writeComment(commentDto);
    }

    @PatchMapping("comment")
    @ResponseBody
    public String patchComment(CommentDto commentDto) {
        return articleService.updateComment(commentDto);
    }

    @PostMapping("subComment")
    @ResponseBody
    public String postSubComment(SubCommentDto subCommentDto) {
        return articleService.writeSubComment(subCommentDto);
    }

    @PatchMapping("subComment")
    @ResponseBody
    public String patchSubComment(SubCommentDto subCommentDto) {
        return articleService.updateSubComment(subCommentDto);
    }

    @PostMapping("commentLike")
    @ResponseBody
    public String postCommentLike(CommentLikeDto commentLikeDto) {
        return articleService.commentLike(commentLikeDto);
    }

    @PatchMapping("commentLike")
    @ResponseBody
    public String patchCommentLike(CommentLikeDto commentLikeDto) {
        return articleService.updateCommentLike(commentLikeDto);
    }

    @DeleteMapping("commentLike")
    @ResponseBody
    public String deleteCommentLike(CommentLikeDto commentLikeDto) {
        return articleService.deleteCommentLike(commentLikeDto);
    }

    @PostMapping("subCommentLike")
    @ResponseBody
    public String postSubCommentLike(SubCommentLikeDto subCommentLikeDto) {
        return articleService.subCommentLike(subCommentLikeDto);
    }

    @PatchMapping("subCommentLike")
    @ResponseBody
    public String patchSubCommentLike(SubCommentLikeDto subCommentLikeDto) {
        return articleService.updateSubCommentLike(subCommentLikeDto);
    }

    @DeleteMapping("subCommentLike")
    @ResponseBody
    public String deleteSubCommentLike(SubCommentLikeDto subCommentLikeDto) {
        return articleService.deleteSubCommentLike(subCommentLikeDto);
    }
}
