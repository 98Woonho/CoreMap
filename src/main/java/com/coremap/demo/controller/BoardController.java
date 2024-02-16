package com.coremap.demo.controller;

import com.coremap.demo.domain.entity.Article;
import com.coremap.demo.domain.entity.Board;
import com.coremap.demo.domain.service.BoardService;
import com.coremap.demo.domain.vo.PageVo;
import com.coremap.demo.domain.vo.SearchVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.List;

@Controller
@Slf4j
@RequestMapping("board")
public class BoardController {
    @Autowired
    private BoardService boardService;

    @GetMapping("list")
    public void getList(@RequestParam(value = "code") String code,
                        @RequestParam(value = "page", required = false, defaultValue = "1") int page,
                        SearchVo search,
                        Model model) {
        Board[] boards = boardService.getBoards();

        Board board = Arrays.stream(boards).filter(x -> x.getCode().equals(code)).findFirst().orElse(null);

        if (board != null) {
            search.setBoardCode(code);
            // 검색을 제출하면 HTML에서 전송된 code와 criterion, keyword가 search에 저장이 됨. 그래서 현재 페이지가 검색중인 페이지인지 아닌지 boolean 형식으로 초기화 해줌.
            final boolean searching = search.getCriterion() != null && search.getKeyword() != null; // 검색 중인지 아닌지
            final int countPerPage = 20;
            final int pageButtonCount = 10;
            int totalCount = searching
                    ? this.boardService.getArticleCount(board, search)
                    : this.boardService.getArticleCount(board);
            PageVo pageVo = new PageVo(page, countPerPage, pageButtonCount, totalCount);
            List<Article> articleList = searching
                    ? this.boardService.getArticles(board, pageVo, search)
                    : this.boardService.getArticles(board, pageVo);
            model.addAttribute("articleList", articleList);
            model.addAttribute("page", pageVo);
            model.addAttribute("searching", searching);
            model.addAttribute("search", search);
        }
        model.addAttribute("board", board);
    }
}
