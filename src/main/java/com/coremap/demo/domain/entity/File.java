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
@Table(name="file")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private int size;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] data;
    private int articleIndex;
    @ManyToOne
    @JoinColumn(name="user_username", foreignKey = @ForeignKey(name="fk_file_user_username", foreignKeyDefinition = "FOREIGN KEY(user_username) REFERENCES user(username) ON DELETE CASCADE ON UPDATE CASCADE"))
    private User user;
    private Date createdAt;
}
