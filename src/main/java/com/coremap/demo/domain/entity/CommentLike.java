package com.coremap.demo.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@IdClass(CommentLikeId.class)
@Table(name="comment_like")
public class CommentLike {
    @Id
    @ManyToOne
    @JoinColumn(name="comment_id", foreignKey = @ForeignKey(name="fk_comment_like_comment_id", foreignKeyDefinition = "FOREIGN KEY(comment_id) REFERENCES comment(id) ON DELETE CASCADE ON UPDATE CASCADE"))
    private Comment comment;

    @Id
    @ManyToOne
    @JoinColumn(name="user_username", foreignKey = @ForeignKey(name="fk_comment_like_user_username", foreignKeyDefinition = "FOREIGN KEY(user_username) REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE"))
    private User user;
    private Boolean isLike;
}
