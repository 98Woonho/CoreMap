package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.EmailAuth;
import com.coremap.demo.domain.entity.EmailAuthId;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface EmailAuthRepository extends JpaRepository<EmailAuth, EmailAuthId> {
    boolean existsByEmailAndCodeAndSalt(String email, String code, String salt);

    EmailAuth findByEmailAndCodeAndSalt(@Param(value="email") String email,
                                           @Param(value="code") String code,
                                           @Param(value="salt") String salt);


//    @Modifying
//    @Query("UPDATE EmailAuth e " +
//            "SET e.isVerified = :#{#emailAuth.isVerified}, " +
//            "e.createdAt = :#{#emailAuth.createdAt}, " +
//            "e.expiresAt = :#{#emailAuth.expiresAt} " +
//            "WHERE BINARY (e.email) = :#{#emailAuth.email} " +
//            "AND BINARY (e.code) = :#{#emailAuth.code} " +
//            "AND BINARY (e.salt) = :#{#emailAuth.salt}")
//    int updateEmailAuth(EmailAuth emailAuth);
}
