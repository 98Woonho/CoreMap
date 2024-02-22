package com.coremap.demo.domain.service;

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
    private SubCommentRepository subCommentRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private SubCommentLikeRepository subCommentLikeRepository;

    public Article getArticle(Long indexInBoard, String boardCode) {
        Article article = articleRepository.findByIndexInBoardAndBoardCode(indexInBoard, boardCode);

        int view = article.getView();
        view += 1;

        article.setView(view);

        articleRepository.save(article);

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

    public List<Comment> getCommentList(Long id) {
        return commentRepository.findByArticleId(id);
    }

    public List<SubComment> getSubCommentList(Long id) {
        return subCommentRepository.findByCommentArticleId(id);
    }

    public List<CommentLike> getCommentLikeList(Long id) {
        return commentLikeRepository.findByCommentArticleId(id);
    }

    public int getLikeCount(Long id, boolean isLike) {
        List<CommentLike> likeList = commentLikeRepository.findByCommentIdAndIsLikeIs(id, isLike);

        return likeList.size();
    }

    public int getSubCommentLikeCount(Long id, boolean isLike) {
        List<SubCommentLike> likeList = subCommentLikeRepository.findBySubCommentIdAndIsLikeIs(id, isLike);

        return likeList.size();
    }

    public int getDislikeCount(Long id, boolean isLike) {
        List<CommentLike> likeList = commentLikeRepository.findByCommentIdAndIsLikeIs(id, isLike);

        return likeList.size();
    }

    public int getSubCommentDislikeCount(Long id, boolean isLike) {
        List<SubCommentLike> likeList = subCommentLikeRepository.findBySubCommentIdAndIsLikeIs(id, isLike);

        return likeList.size();
    }

    public List<SubCommentLike> getSubCommentLikeList(Long id) {
        return subCommentLikeRepository.findBySubCommentCommentArticleId(id);
    }


    @Transactional(rollbackFor = Exception.class)
    public Image uploadImage(ImageDto imageDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();
        imageDto.setCreatedAt(new Date());

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
        fileDto.setCreatedAt(new Date());

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

        if(articleRepository.findTopByBoardCodeOrderByIndexInBoardDesc(articleDto.getBoardCode()) != null) {
            Article latestArticle = articleRepository.findTopByBoardCodeOrderByIndexInBoardDesc(articleDto.getBoardCode());

            Long latestIndexInBoard = latestArticle.getIndexInBoard();
            article.setIndexInBoard(latestIndexInBoard + 1);
        } else {
            article.setIndexInBoard(1L);
        }

        article.setUser(user);
        article.setView(0);
        article.setWrittenAt(new Date());
        article.setModifiedAt(null);
        article.setDeleted(false);
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setBoard(board);

        articleRepository.save(article);

        Article writedArticle = articleRepository.findById(article.getId()).get();

        for (int fileId : fileIdArray) {
            File file = fileRepository.findById((long) fileId).get();

            if (file == null) {
                continue;
            }

            file.setArticle(writedArticle);
            fileRepository.save(file);
        }

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
            // 수정 할려는 게시글의 파일 인덱스 배열(fileIndexes)에서 원래 게시글의 파일목록 중 하나의 인덱스를 비교 했는데 아무것도 없을 때 == 파일을 삭제 했을 때
            if (Arrays.stream(fileIdArray).noneMatch(x -> x == originalFile.getId())) {
                fileRepository.deleteById(originalFile.getId());
            }
        }

        for (Image originalImage : originalImages) {
            if (Arrays.stream(imgIdArray).noneMatch(x -> x == originalImage.getId())) {
                imageRepository.deleteById(originalImage.getId());
            }
        }

        Article article = articleRepository.findById(articleDto.getId()).get();

        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());
        article.setModifiedAt(new Date());

        articleRepository.save(article);

        Article newArticle = articleRepository.findById(article.getId()).get();

        for (int fileId : fileIdArray) {
            File file = fileRepository.findById((long) fileId).get();

            if (file == null) {
                continue;
            }

            file.setArticle(newArticle);
            fileRepository.save(file);
        }

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
        comment.setWrittenAt(new Date());

        commentRepository.save(comment);

        CommentLike commentLike = new CommentLike();
        commentLike.setUser(user);
        commentLike.setComment(comment);
        
        commentLikeRepository.save(commentLike);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String updateComment(CommentDto commentDto) {
        Comment comment = commentRepository.findById(commentDto.getId()).get();

        comment.setContent(commentDto.getContent());
        comment.setModifiedAt(new Date());

        commentRepository.save(comment);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String writeSubComment(SubCommentDto subCommentDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        Comment comment = commentRepository.findById(subCommentDto.getCommentId()).get();

        SubComment subComment = new SubComment();
        subComment.setContent(subCommentDto.getContent());
        subComment.setComment(comment);
        subComment.setUser(user);
        subComment.setWrittenAt(new Date());

        subCommentRepository.save(subComment);

        SubCommentLike subCommentLike = new SubCommentLike();
        subCommentLike.setUser(user);
        subCommentLike.setSubComment(subComment);

        subCommentLikeRepository.save(subCommentLike);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String updateSubComment(SubCommentDto subCommentDto) {
        SubComment subComment = subCommentRepository.findById(subCommentDto.getId()).get();

        subComment.setContent(subCommentDto.getContent());
        subComment.setModifiedAt(new Date());

        subCommentRepository.save(subComment);

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

        commentLike.setIsLike(commentLikeDto.getIsLike().equals("true"));

        commentLikeRepository.save(commentLike);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String updateCommentLike(CommentLikeDto commentLikeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        Comment comment = commentRepository.findById(commentLikeDto.getCommentId()).get();

        CommentLike commentLike = commentLikeRepository.findByCommentIdAndUserUsername(comment.getId(), user.getUsername());

        commentLike.setIsLike(commentLikeDto.getIsLike().equals("true"));

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String deleteCommentLike(CommentLikeDto commentLikeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        Comment comment = commentRepository.findById(commentLikeDto.getCommentId()).get();

        CommentLike commentLike = commentLikeRepository.findByCommentIdAndUserUsername(comment.getId(), user.getUsername());

        commentLike.setIsLike(null);

        commentLikeRepository.save(commentLike);

        return "SUCCESS";
    }



    
    @Transactional(rollbackFor = Exception.class)
    public String subCommentLike(SubCommentLikeDto subCommentLikeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        SubComment subComment = subCommentRepository.findById(subCommentLikeDto.getSubCommentId()).get();

        SubCommentLike subCommentLike = new SubCommentLike();
        subCommentLike.setSubComment(subComment);
        subCommentLike.setUser(user);

        subCommentLike.setIsLike(subCommentLikeDto.getIsLike().equals("true"));

        subCommentLikeRepository.save(subCommentLike);

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String updateSubCommentLike(SubCommentLikeDto subCommentLikeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        SubComment subComment = subCommentRepository.findById(subCommentLikeDto.getSubCommentId()).get();

        SubCommentLike subCommentLike = subCommentLikeRepository.findBySubCommentIdAndUserUsername(subComment.getId(), user.getUsername());

        subCommentLike.setIsLike(subCommentLikeDto.getIsLike().equals("true"));

        return "SUCCESS";
    }

    @Transactional(rollbackFor = Exception.class)
    public String deleteSubCommentLike(SubCommentLikeDto subCommentLikeDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findById(username).get();

        SubComment subComment = subCommentRepository.findById(subCommentLikeDto.getSubCommentId()).get();

        SubCommentLike subCommentLike = subCommentLikeRepository. findBySubCommentIdAndUserUsername(subComment.getId(), user.getUsername());

        subCommentLike.setIsLike(null);

        subCommentLikeRepository.save(subCommentLike);

        return "SUCCESS";
    }
}
