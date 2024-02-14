package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.Comment;
import com.coremap.demo.domain.entity.SubComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubCommentRepository extends JpaRepository<SubComment, Long> {
    List<SubComment> findByCommentArticleId(Long id);
}
