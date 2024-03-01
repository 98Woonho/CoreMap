package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    List<File> findByArticleId(Long id);
}
