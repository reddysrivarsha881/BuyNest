package Online.Shopping.Management.System.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import Online.Shopping.Management.System.dto.ResponseStructure;
import Online.Shopping.Management.System.entity.Category;
import Online.Shopping.Management.System.service.CategoryService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://buynest-frontend-5fyu.onrender.com"
})
public class CategoryController {

    @Autowired
    private CategoryService categoryService;


    // SAVE CATEGORY
    @PostMapping("/saveCategory")
    public ResponseStructure<Category> saveCategory(
            @Valid @RequestBody Category category) {

        return categoryService.saveCategory(category);
    }


    // GET ALL CATEGORIES
    @GetMapping("/getCategories")
    public ResponseStructure<List<Category>> getCategories() {

        return categoryService.getCategories();
    }


    // GET CATEGORY BY ID
    @GetMapping("/getCategory/{id}")
    public ResponseStructure<Category> getCategoryById(
            @PathVariable Long id) {

        return categoryService.getCategoryById(id);
    }


    // UPDATE CATEGORY
    @PutMapping("/updateCategory/{id}")
    public ResponseStructure<Category> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody Category category) {

        return categoryService.updateCategory(id, category);
    }


    // DELETE CATEGORY
    @DeleteMapping("/deleteCategory/{id}")
    public ResponseStructure<Category> deleteCategoryById(
            @PathVariable Long id) {

        return categoryService.deleteCategoryById(id);
    }

}