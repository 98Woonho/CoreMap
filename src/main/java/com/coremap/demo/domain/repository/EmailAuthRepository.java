package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.EmailAuth;
import com.coremap.demo.domain.entity.EmailAuthId;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface EmailAuthRepository extends JpaRepository<EmailAuth, EmailAuthId> {
    EmailAuth findByEmailAndCodeAndSalt(@Param(value="email") String email,
                                           @Param(value="code") String code,
                                           @Param(value="salt") String salt);
}
