package com.coremap.demo.domain.mapper;

import com.coremap.demo.domain.entity.EmailAuth;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    int insertEmailAuth(EmailAuth emailAuth);
}
