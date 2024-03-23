package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.EmailAuth;
import com.coremap.demo.domain.entity.EmailAuthId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailAuthRepository extends JpaRepository<EmailAuth, EmailAuthId> {
    EmailAuth findByEmailAndCodeAndSalt(String email,
                                        String code,
                                        String salt);
}
