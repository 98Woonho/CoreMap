package com.coremap.demo.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="article")
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_username", foreignKey = @ForeignKey(name="fk_article_user_username", foreignKeyDefinition = "FOREIGN KEY(user_username) REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE"))
    private User user;

    @ManyToOne
    @JoinColumn(name="board_code", foreignKey = @ForeignKey(name="fk_article_board_code", foreignKeyDefinition = "FOREIGN KEY(board_code) REFERENCES board(code) ON DELETE CASCADE ON UPDATE CASCADE"))
    private Board board;
    private String title;
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    private int view;
    @Column(columnDefinition = "DATETIME(6) DEFAULT NOW()")
    private LocalDateTime writtenAt;
    private LocalDateTime modifiedAt;
    private Long indexInBoard;
}