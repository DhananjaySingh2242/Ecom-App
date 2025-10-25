package com.ecom.productcatalog.service;

import java.util.List;
import com.ecom.productcatalog.model.Category;

import org.springframework.stereotype.Service;

import com.ecom.productcatalog.repository.CategoryRepository;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
