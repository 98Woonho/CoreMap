package com.coremap.demo.domain.service;

import com.coremap.demo.config.auth.PrincipalDetails;
import com.coremap.demo.domain.dto.FileDto;
import com.coremap.demo.domain.dto.ImageDto;
import com.coremap.demo.domain.entity.File;
import com.coremap.demo.domain.entity.Image;
import com.coremap.demo.domain.entity.User;
import com.coremap.demo.domain.repository.FileRepository;
import com.coremap.demo.domain.repository.ImageRepository;
import com.coremap.demo.domain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Date;

@Service
public class ArticleService {
    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

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
}
