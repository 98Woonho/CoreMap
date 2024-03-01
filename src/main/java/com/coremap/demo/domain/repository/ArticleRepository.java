package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    @Query("SELECT a FROM Article a " +
            "WHERE a.board.code = :code " +
            "AND (:keyword IS NULL OR " +
            "(:criterion ='content' AND a.content LIKE %:keyword%) " +
            "OR (:criterion = 'title' AND a.title LIKE %:keyword%) " +
            "OR (:criterion = 'nickname' AND a.user.nickname LIKE %:keyword%))" +
            "ORDER BY a.id DESC")
    Page<Article> findByBoardAndPage(String code, Pageable pageable, String keyword, String criterion);

    List<Article> findByBoardCode(String boardCode);

    List<Article> findByBoardCodeAndTitleContaining(String boardCode, String keyword);

    List<Article> findByBoardCodeAndContentContaining(String boardCode, String keyword);

    List<Article> findByBoardCodeAndUserNicknameContaining(String boardCode, String keyword);

    Article findTopByBoardCodeOrderByIndexInBoardDesc(String boardCode);

    Article findByIndexInBoardAndBoardCode(Long indexInBoard, String boardCode);
}