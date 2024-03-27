package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.dto.CommentDto;
import com.coremap.demo.domain.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByArticleId(Long id);
}
