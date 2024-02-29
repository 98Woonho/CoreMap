package com.coremap.demo.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="comment")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="article_id", foreignKey = @ForeignKey(name="fk_comment_article_id", foreignKeyDefinition = "FOREIGN KEY(article_id) REFERENCES article(id) ON DELETE CASCADE ON UPDATE CASCADE"))
    private Article article;

    @ManyToOne
    @JoinColumn(name="user_username", foreignKey = @ForeignKey(name="fk_comment_user_username", foreignKeyDefinition = "FOREIGN KEY(user_username) REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE"))
    private User user;
    @Column(columnDefinition = "VARCHAR(1000)")
    private String content;
    private Date writtenAt;
    private Date modifiedAt;
}
