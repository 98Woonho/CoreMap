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
    @Autowired BoardRepository boardRepository;

    @ModelAttribute
    public void addCommonAttributes(Model model) {
        List<Board> boardList = boardRepository.findAll();
        model.addAttribute("boardList", boardList);
    }
}
