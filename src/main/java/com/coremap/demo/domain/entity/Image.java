package com.coremap.demo.domain.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.resource.beans.container.internal.CdiBasedBeanContainer;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name="image")
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private int size;
    @Column(columnDefinition = "LONGBLOB")
    private byte[] data;
    private String username;
    private Date createdAt;

    public Image(MultipartFile file) throws IOException {
        super();
        this.name = file.getOriginalFilename();
        this.type = file.getContentType();
        this.size = (int) file.getSize();
        this.data = file.getBytes();
    }
}
