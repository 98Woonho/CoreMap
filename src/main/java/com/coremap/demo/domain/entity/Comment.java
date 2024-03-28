package com.coremap.demo.domain.entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
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

    @ManyToOne
    @JoinColumn(name="comment_id", foreignKey = @ForeignKey(name="fk_comment_comment_id", foreignKeyDefinition = "FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE ON UPDATE CASCADE"))
    private Comment comment;

    @Column(columnDefinition = "VARCHAR(1000)")
    private String content;
    private LocalDateTime writtenAt;


    @Column(columnDefinition = "DEFAULT NULL")
    private LocalDateTime modifiedAt;
    private Boolean isDeleted;
}
