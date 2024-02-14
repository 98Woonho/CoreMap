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
@IdClass(SubCommentLikeId.class)
@Table(name="sub_comment_like")
public class SubCommentLike {
    @Id
    @ManyToOne
    @JoinColumn(name="sub_comment_id", foreignKey = @ForeignKey(name="fk_sub_comment_like_sub_comment_id", foreignKeyDefinition = "FOREIGN KEY(sub_comment_id) REFERENCES sub_comment(id) ON DELETE CASCADE ON UPDATE CASCADE"))
    private SubComment subComment;

    @Id
    @ManyToOne
    @JoinColumn(name="user_username", foreignKey = @ForeignKey(name="fk_sub_comment_like_user_username", foreignKeyDefinition = "FOREIGN KEY(user_username) REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE"))
    private User user;
    private boolean isLike;
}
