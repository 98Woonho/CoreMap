package com.coremap.demo.domain.service;

import com.coremap.demo.domain.dto.ArticleDto;
import com.coremap.demo.domain.dto.FileDto;
import com.coremap.demo.domain.dto.ImageDto;
import com.coremap.demo.domain.entity.Article;
import com.coremap.demo.domain.entity.File;
import com.coremap.demo.domain.entity.Image;
import com.coremap.demo.domain.entity.User;
import com.coremap.demo.domain.repository.ArticleRepository;
import com.coremap.demo.domain.repository.FileRepository;
import com.coremap.demo.domain.repository.ImageRepository;
import com.coremap.demo.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public Article getArticle(Long id) {
        return articleRepository.findById(id).get();
    }

    public List<File> getFileList(Long id) {
        return fileRepository.findByArticleId(id);
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

        Article article = new Article();

        article.setUser(user);
        article.setView(0);
        article.setWrittenAt(new Date());
        article.setModifiedAt(null);
        article.setDeleted(false);
        article.setTitle(articleDto.getTitle());
        article.setContent(articleDto.getContent());

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

        return article.getId();
    }
}
