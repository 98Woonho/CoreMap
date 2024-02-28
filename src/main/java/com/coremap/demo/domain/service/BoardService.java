package com.coremap.demo.domain.service;

import com.coremap.demo.domain.entity.Article;
import com.coremap.demo.domain.entity.Board;
import com.coremap.demo.domain.entity.User;
import com.coremap.demo.domain.repository.ArticleRepository;
import com.coremap.demo.domain.repository.BoardRepository;
import com.coremap.demo.domain.repository.UserRepository;
import com.coremap.demo.domain.vo.PageVo;
import com.coremap.demo.domain.vo.SearchVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BoardService {
    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    public User getUser(String username) {
        return userRepository.findById(username).get();
    }

    public List<Article> getArticles(Board board, PageVo page) {
        Pageable pageable = PageRequest.of(page.requestPage - 1, page.countPerPage);
        Page<Article> articlePage = articleRepository.findByBoardAndPage(board.getCode(), pageable, null, null);

        return articlePage.getContent();
    }

    public List<Article> getArticles(Board board, PageVo page, SearchVo search) {
        Pageable pageable = PageRequest.of(page.requestPage - 1, page.countPerPage);
        Page<Article> articlePage =  articleRepository.findByBoardAndPage(board.getCode(), pageable, search.getKeyword(), search.getCriterion());

        return articlePage.getContent();
    }

    public int getArticleCount(Board board) {
        List<Article> articleList = articleRepository.findByBoardCode(board.getCode());

        return articleList.size();
    }

    public int getArticleCount(Board board, SearchVo search) {
        List<Article> articleList = new ArrayList<>();

        if(search.getCriterion().equals("title")) {
            articleList = articleRepository.findByBoardCodeAndTitleContaining(board.getCode(), search.getKeyword());
        }

        if(search.getCriterion().equals("content")) {
            articleList = articleRepository.findByBoardCodeAndContentContaining(board.getCode(), search.getKeyword());
        }

        if(search.getCriterion().equals("nickname")) {
            articleList = articleRepository.findByBoardCodeAndUserNicknameContaining(board.getCode(), search.getKeyword());
        }

        return articleList.size();
    }

    public Board[] getBoards() {
        List<Board> boardList = boardRepository.findAll();
        return boardList.toArray(new Board[0]);
    }
}
