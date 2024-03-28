package com.coremap.demo.controller;

import com.coremap.demo.domain.entity.Board;
import com.coremap.demo.domain.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class ControllerAdvice {
    @Autowired
    private BoardRepository boardRepository;

    // 모든 컨트롤러 실행 전에 호출됨.
    @ModelAttribute
    public void addCommonAttributes(Model model) {
        List<Board> boardList = boardRepository.findAll();

        // 모든 뷰에서 사용 가능
        model.addAttribute("boardList", boardList);
    }
}
