package com.coremap.demo.domain.repository;

import com.coremap.demo.domain.entity.ContactCompany;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactCompanyRepository extends JpaRepository<ContactCompany, String> {

}
