package com.coremap.demo.service;

import com.coremap.demo.domain.entity.Exercise;
import com.coremap.demo.domain.repository.ExerciseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HomeService {
    @Autowired
    private ExerciseRepository exerciseRepository;

    public Exercise getExercise(String name) {
        return exerciseRepository.findById(name).get();
    }
}
