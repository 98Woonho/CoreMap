package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, String> {
}
