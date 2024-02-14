package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.SubComment;
import com.coremap.demo.domain.entity.SubCommentLike;
import com.coremap.demo.domain.entity.SubCommentLikeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubCommentLikeRepository extends JpaRepository<SubCommentLike, SubCommentLikeId> {
    List<SubCommentLike> findBySubCommentCommentArticleId(Long id);
}
