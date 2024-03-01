package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.CommentLike;
import com.coremap.demo.domain.entity.CommentLikeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentLikeRepository extends JpaRepository<CommentLike, CommentLikeId> {
    List<CommentLike> findByCommentArticleId(Long id);

    CommentLike findByCommentIdAndUserUsername(Long commentId, String username);

    void deleteByCommentIdAndUserUsername(Long commentId, String username);

    List<CommentLike> findByCommentIdAndIsLikeIs(Long id, boolean isLike);
}
