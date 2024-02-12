package com.coremap.demo.domain.vo;

import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@Builder
public class SearchVo {
    private String boardCode;
    private String criterion;
    private String keyword;
}
