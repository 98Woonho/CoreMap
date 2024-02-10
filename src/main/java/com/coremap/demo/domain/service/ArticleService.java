package com.coremap.demo.domain.service;

import com.coremap.demo.domain.entity.Image;
import com.coremap.demo.domain.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;

@Service
public class ArticleService {
    @Autowired
    private ImageRepository imageRepository;

    @Transactional(rollbackFor = Exception.class)
    public String uploadImage(Image image, String username) {
        image.setUsername(username);
        image.setCreatedAt(new Date());


        imageRepository.save(image);

        return "SUCCESS";
    }

    public Image getImage(Long id) {
        return imageRepository.findById(id).get();
    }
}
