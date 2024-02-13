package com.coremap.demo.domain.service;

import com.coremap.demo.domain.dto.ArticleDto;
import com.coremap.demo.domain.dto.FileDto;
import com.coremap.demo.domain.dto.ImageDto;
import com.coremap.demo.domain.entity.*;
import com.coremap.demo.domain.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Article getArticle(Long indexInBoard, String boardCode) {
        return articleRepository.findByIndexInBoardAndBoardCode(indexInBoard, boardCode);
    }

    public Article getArticle(Long id) {
        return articleRepository.findById(id).get();
    }

    public List<File> getFileList(Long id) {
        return fileRepository.findByArticleId(id);
    }

    public Board[] getBoards() {
        List<Board> boardList = boardRepository.findAll();
        return boardList.toArray(new Board[0]);
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

        for (int fileId : fileIdArray) {
            File file = fileRepository.findById((long) fileId).get();

            if (file == null) {
                continue;
            }

            file.setArticleId(article.getId());
            fileRepository.save(file);
        }

        for (int imgId : imgIdArray) {
            Image image = imageRepository.findById((long) imgId).get();

            if (image == null) {
                continue;
            }

            image.setArticleId(article.getId());
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

        for (int fileId : fileIdArray) {
            File file = fileRepository.findById((long) fileId).get();

            if (file == null) {
                continue;
            }

            file.setArticleId(article.getId());
            fileRepository.save(file);
        }

        for (int imgId : imgIdArray) {
            Image image = imageRepository.findById((long) imgId).get();

            if (image == null) {
                continue;
            }

            image.setArticleId(article.getId());
            imageRepository.save(image);
        }

        return "SUCCESS";
    }
}
