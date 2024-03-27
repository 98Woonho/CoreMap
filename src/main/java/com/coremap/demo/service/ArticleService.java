package com.coremap.demo.service;

import com.coremap.demo.domain.dto.*;
import com.coremap.demo.domain.entity.*;
import com.coremap.demo.domain.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
public class ArticleService {
    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    public User getUser(String username) {
        return userRepository.findById(username).get();
    }

    public Board getBoard(String code) {
        return boardRepository.findById(code).get();
    }

    public int getLikeCount(Long commentId, Boolean status) {


        return commentLikeRepository.findAllByCommentIdAndLikeStatus(commentId, status).size();
    }

    public int getDislikeCount(Long commentId, Boolean status) {
        return commentLikeRepository.findAllByCommentIdAndLikeStatus(commentId, status).size();
    }

    public int getLikeStatus(Long commentId, String username) {
        CommentLike commentLike = commentLikeRepository.findByCommentIdAndUserUsername(commentId, username);

        if(commentLike == null) {
            return 0;
        }

        return commentLike.getLikeStatus() ? 1 : -1;
    }

    public Article getArticle(Long indexInBoard, String boardCode) {
        Article article = articleRepository.findByIndexInBoardAndBoardCode(indexInBoard, boardCode);

        // 게시글 불러올 때 조회수 증가
        if (article != null) {
            int view = article.getView();
            view += 1;

            article.setView(view);

            articleRepository.save(article);
        }

        return article;
    }

    public File getFile(Long id) {
        return fileRepository.findById(id).get();
    }

    public List<File> getFileList(Long id) {
        return fileRepository.findByArticleId(id);
    }

    public Board[] getBoards() {
        List<Board> boardList = boardRepository.findAll();
        return boardList.toArray(new Board[0]);
    }

    public List<Comment> getCommentList(Long articleId) {
        return commentRepository.findByArticleId(articleId);
    }

    @Transactional(rollbackFor = Exception.class)
    public Image uploadImage(ImageDto imageDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();
        imageDto.setCreatedAt(LocalDateTime.now());

        Image image = new Image();
        image.setType(imageDto.getType());
        image.setSize(imageDto.getSize());
        image.setData(imageDto.getData());
        image.setName(imageDto.getName());
        image.setUser(user);
        image.setCreatedAt(imageDto.getCreatedAt());

        return imageRepository.save(image);
    }

    public Image getImage(Long id) {
        return imageRepository.findById(id).get();
    }

    @Transactional(rollbackFor = Exception.class)
    public File uploadFile(FileDto fileDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();
        fileDto.setCreatedAt(LocalDateTime.now());

        File file = new File();
        file.setType(fileDto.getType());
        file.setSize(fileDto.getSize());
        file.setData(fileDto.getData());
        file.setName(fileDto.getName());
        file.setUser(user);
        file.setCreatedAt(fileDto.getCreatedAt());

        return fileRepository.save(file);
    }

    @Transactional(rollbackFor = Exception.class)
    public Long write(ArticleDto articleDto, int[] fileIdArray, int[] imgIdArray) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        Board board = boardRepository.findById(articleDto.getBoardCode()).get();

        Article article = new Article();

        // 작성할려는 게시판에 게시글이 있으면, 제일 최근 게시글의 인덱스에 +1을 한 인덱스를 현재 작성할려는 게시글에 set
        if (articleRepository.findTopByBoardCodeOrderByIndexInBoardDesc(articleDto.getBoardCode()) != null) {
            Article latestArticle = articleRepository.findTopByBoardCodeOrderByIndexInBoardDesc(articleDto.getBoardCode());

            Long latestIndexInBoard = latestArticle.getIndexInBoard();
            article.setIndexInBoard(latestIndexInBoard + 1);
        }
        // 작성할려는 게시판에 게시글이 없으면 해당 게시판의 첫 번째 인덱스(1) set
        else {
            article.setIndexInBoard(1L);
        }

        article.setUser(user);
        article.setView(0);
        article.setWrittenAt(LocalDateTime.now());
        article.setModifiedAt(null);
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setBoard(board);

        articleRepository.save(article);

        Article writedArticle = articleRepository.findById(article.getId()).get();

        // 작성할려는 게시글의 id를 file에 set (file은 게시글 작성하는 페이지에서 등록 시점에 DB에 등록 됨)
        for (int fileId : fileIdArray) {
            File file = fileRepository.findById((long) fileId).get();

            if (file == null) {
                continue;
            }

            file.setArticle(writedArticle);
            fileRepository.save(file);
        }

        // 작성할려는 게시글의 id를 image에 set (image는 게시글 작성하는 페이지에서 등록 시점에 DB에 등록 됨)
        for (int imgId : imgIdArray) {
            Image image = imageRepository.findById((long) imgId).get();

            if (image == null) {
                continue;
            }

            image.setArticle(writedArticle);
            imageRepository.save(image);
        }

        return article.getIndexInBoard();
    }


    @Transactional(rollbackFor = Exception.class)
    public String modify(ArticleDto articleDto, int[] fileIdArray, int[] imgIdArray) {
        List<File> originalFiles = fileRepository.findByArticleId(articleDto.getId());

        List<Image> originalImages = imageRepository.findByArticleId(articleDto.getId());

        for (File originalFile : originalFiles) {
            // 수정 할려는 게시글의 파일 인덱스 배열(fileIdArray)에서 원래 게시글의 파일 목록 중 하나의 인덱스를 비교 했는데 아무것도 없을 때 == 파일을 삭제 했을 때
            if (Arrays.stream(fileIdArray).noneMatch(x -> x == originalFile.getId())) {
                fileRepository.deleteById(originalFile.getId());
            }
        }

        for (Image originalImage : originalImages) {
            // 수정 할려는 게시글의 이미지 인덱스 배열(imgIdArray)에서 원래 게시글의 이미지 목록 중 하나의 인덱스를 비교 했는데 아무것도 없을 때 == 이미지를 삭제 했을 때
            if (Arrays.stream(imgIdArray).noneMatch(x -> x == originalImage.getId())) {
                imageRepository.deleteById(originalImage.getId());
            }
        }

        Article article = articleRepository.findById(articleDto.getId()).get();

        // 게시글 수정사항 set
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setModifiedAt(LocalDateTime.now());

        articleRepository.save(article);

        Article newArticle = articleRepository.findById(article.getId()).get();

        // 수정할려는 게시글의 id를 file에 set (file은 게시글 수정하는 페이지에서 등록 시점에 DB에 등록 됨)
        for (int fileId : fileIdArray) {
            File file = fileRepository.findById((long) fileId).get();

            if (file == null) {
                continue;
            }

            file.setArticle(newArticle);
            fileRepository.save(file);
        }

        // 수정할려는 게시글의 id를 image에 set (image는 게시글 수정하는 페이지에서 등록 시점에 DB에 등록 됨)
        for (int imgId : imgIdArray) {
            Image image = imageRepository.findById((long) imgId).get();

            if (image == null) {
                continue;
            }

            image.setArticle(newArticle);
            imageRepository.save(image);
        }

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String delete(Long id) {
        articleRepository.deleteById(id);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String writeComment(CommentDto commentDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        Article article = articleRepository.findById(commentDto.getArticleId()).get();

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setArticle(article);
        comment.setUser(user);
        comment.setWrittenAt(LocalDateTime.now());
        comment.setIsDeleted(false);

        if(commentDto.getCommentId() != null) {
            Comment parentComment = commentRepository.findById(commentDto.getCommentId()).get();

            comment.setComment(parentComment);
        } else {
            comment.setComment(null);
        }

        commentRepository.save(comment);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String updateComment(CommentDto commentDto) {
        Comment comment = commentRepository.findById(commentDto.getId()).get();

        comment.setContent(commentDto.getContent());
        comment.setModifiedAt(LocalDateTime.now());

        commentRepository.save(comment);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String deleteComment(Long id) {
        commentRepository.deleteById(id);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String commentLike(CommentLikeDto commentLikeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        Comment comment = commentRepository.findById(commentLikeDto.getCommentId()).get();

        CommentLike commentLike = new CommentLike();
        commentLike.setComment(comment);
        commentLike.setUser(user);

        commentLike.setLikeStatus(commentLikeDto.getIsLike().equals("true"));

        commentLikeRepository.save(commentLike);

        return "SUCCESS";
    }

    // 댓글 좋아요 기능
    @Transactional(rollbackFor = Exception.class)
    public String updateCommentLike(Long commentId, Boolean status, UserDto userDto) {
        // commentIndex & user.email로 가져온 CommentLikeEntity가 없고(null 이고),
        // status 가 true라면 좋아요로 INSERT,
        // status 가 false 라면, 싫어요로 INSERT,
        // status 가 null 이라면, 논리적 오류

        // commentIndex & user.email로 가져온 CommentLikeEntity가 있고(null이 아니고),
        // status 가 true라면 좋아요로 수정,
        // status 가 false 라면, 싫어요로 수정,
        // status 가 null 이라면, DELETE

        Comment comment = commentRepository.findById(commentId).get();

        CommentLike commentLike = commentLikeRepository.findByCommentIdAndUserUsername(commentId, userDto.getUsername());

        User user = userRepository.findById(userDto.getUsername()).get();

        if (commentLike == null) {
            commentLike.setUser(user);
            commentLike.setComment(comment);
            commentLike.setLikeStatus(status);
        } else {
            if (status == null) {
                commentLikeRepository.deleteByCommentIdAndUserUsername(commentId, user.getUsername());
                return "SUCCESS";
            }
            commentLike.setLikeStatus(status);
        }

        commentLikeRepository.save(commentLike);

        return "SUCCESS";
    }
}