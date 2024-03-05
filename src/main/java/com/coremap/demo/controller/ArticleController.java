package com.coremap.demo.controller;

import com.coremap.demo.domain.dto.*;
import com.coremap.demo.domain.entity.*;
import com.coremap.demo.service.ArticleService;
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
import java.util.*;

@Controller
@Slf4j
@RequestMapping("article")
public class ArticleController {
    @Autowired
    private ArticleService articleService;

    // 게시글 작성 view
    @GetMapping("write")
    public void getWrite(@RequestParam(value = "code", required = false, defaultValue = "") String code,
                         Model model) {
        Board board = articleService.getBoard(code);

        model.addAttribute("board", board);
    }

    // 게시글 작성
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

    // ckeditor getImage
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

    // ckeditor postImage
    @PostMapping("image")
    @ResponseBody
    public String postImage(@RequestParam(value = "upload") MultipartFile file) throws IOException {
        ImageDto imageDto = new ImageDto(file);
        Image image = this.articleService.uploadImage(imageDto);

        JSONObject responseObject = new JSONObject();
        responseObject.put("url", "/article/image?id=" + image.getId());

        return responseObject.toString();
    }

    // 게시글(/article/read) 에서 첨부파일을 클릭하면 실행
    @GetMapping("file")
    public ResponseEntity<byte[]> getFile(@RequestParam(value = "id") Long id) {
        ResponseEntity<byte[]> response;
        File file = this.articleService.getFile(id);
        if (file == null) {
            response = new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            /**
             * ContentDisposition : 파일 다운로드를 할 때 사용되어 웹 서버가 전송한 파일이 브라우저에서 어떻게 처리되어야 하는지를 지정
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

    // 게시글 작성(/article/write)에서 첨부파일 등록
    @PostMapping("file")
    @ResponseBody
    public String postFile(@RequestParam(value = "file") MultipartFile mulitpartFile) throws IOException {
        FileDto fileDto = new FileDto(mulitpartFile);
        File file = this.articleService.uploadFile(fileDto);
        JSONObject responseObject = new JSONObject();
        responseObject.put("id", file.getId());

        return responseObject.toString();
    }

    // 게시글 view
    @GetMapping("read")
    public void getRead(@RequestParam(value = "index") Long index,
                        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                        @RequestParam(value = "criterion", required = false) String criterion,
                        @RequestParam(value = "keyword", required = false) String keyword,
                        @RequestParam(value = "code") String code,
                        Model model) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(principal != "anonymousUser") {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            String username = authentication.getName();

            User user = articleService.getUser(username);
            model.addAttribute("user", user);
        }

        Board[] boards = articleService.getBoards();

        Article article = articleService.getArticle(index, code);

        if(article != null) {
            List<Comment> commentList = articleService.getCommentList(article.getId());

            List<SubComment> subCommentList = articleService.getSubCommentList(article.getId());

            List<CommentLike> commentLikeList = articleService.getCommentLikeList(article.getId());

            List<Map<String, Object>> commentLikeCountList = new ArrayList<>();
            List<Long> existingCommentIdList = new ArrayList<>();

            // 게시글에 있는 각 댓글의 좋아요/싫어요 개수를 가져옴.
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

            // 게시글에 있는 각 답글의 좋아요/싫어요 개수를 가져옴.
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

            Board board = articleService.getBoard(code);
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
    }

    // 게시글 삭제
    @DeleteMapping("read")
    @ResponseBody
    public String deleteRead(@RequestParam(value = "id") Long id) {
        return articleService.delete(id);
    }

    // 게시글 수정 view
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

    // 게시글 수정
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

    // 댓글 작성
    @PostMapping("comment")
    @ResponseBody
    public String postComment(CommentDto commentDto) {
        return articleService.writeComment(commentDto);
    }

    // 댓글 수정
    @PatchMapping("comment")
    @ResponseBody
    public String patchComment(CommentDto commentDto) {
        return articleService.updateComment(commentDto);
    }

    // 댓글 삭제
    @DeleteMapping("comment")
    @ResponseBody
    public String deleteComment(@RequestParam(value = "id") Long id) {
        return articleService.deleteComment(id);
    }

    // 답글 작성
    @PostMapping("subComment")
    @ResponseBody
    public String postSubComment(SubCommentDto subCommentDto) {
        return articleService.writeSubComment(subCommentDto);
    }

    // 답글 수정
    @PatchMapping("subComment")
    @ResponseBody
    public String patchSubComment(SubCommentDto subCommentDto) {
        return articleService.updateSubComment(subCommentDto);
    }

    // 답글 삭제
    @DeleteMapping("subComment")
    @ResponseBody
    public String deleteSubComment(@RequestParam(value = "id") Long id) {
        return articleService.deleteSubComment(id);
    }

    // 댓글 좋아요/싫어요
    @PostMapping("commentLike")
    @ResponseBody
    public String postCommentLike(CommentLikeDto commentLikeDto) {
        return articleService.commentLike(commentLikeDto);
    }

    // 댓글 좋아요/싫어요 수정
    @PatchMapping("commentLike")
    @ResponseBody
    public String patchCommentLike(CommentLikeDto commentLikeDto) {
        return articleService.updateCommentLike(commentLikeDto);
    }

    // 댓글 좋아요/싫어요 취소
    @DeleteMapping("commentLike")
    @ResponseBody
    public String deleteCommentLike(CommentLikeDto commentLikeDto) {
        return articleService.deleteCommentLike(commentLikeDto);
    }

    // 답글 좋아요/싫어요
    @PostMapping("subCommentLike")
    @ResponseBody
    public String postSubCommentLike(SubCommentLikeDto subCommentLikeDto) {
        return articleService.subCommentLike(subCommentLikeDto);
    }

    // 답글 좋아요/싫어요 수정
    @PatchMapping("subCommentLike")
    @ResponseBody
    public String patchSubCommentLike(SubCommentLikeDto subCommentLikeDto) {
        return articleService.updateSubCommentLike(subCommentLikeDto);
    }

    // 답글 좋아요/싫어요 취소
    @DeleteMapping("subCommentLike")
    @ResponseBody
    public String deleteSubCommentLike(SubCommentLikeDto subCommentLikeDto) {
        return articleService.deleteSubCommentLike(subCommentLikeDto);
    }
}
