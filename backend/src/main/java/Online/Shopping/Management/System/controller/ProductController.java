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

import Online.Shopping.Management.System.dto.Productdto;
import Online.Shopping.Management.System.entity.Product;
import Online.Shopping.Management.System.service.ProductService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://buynest-frontend-jqys.onrender.com"
})
public class ProductController {

    @Autowired
    private ProductService productService;


    // =========================
    // SAVE PRODUCT
    // =========================

    @PostMapping("/saveProduct")
    public Productdto saveProduct(
            @Valid @RequestBody Productdto productDTO) {

        return productService.saveProduct(productDTO);
    }


    // =========================
    // GET ALL PRODUCTS
    // =========================

    @GetMapping("/getProducts")
    public List<Product> getProducts() {

        return productService.getProducts();
    }


    // =========================
    // GET PRODUCTS BY CATEGORY
    // =========================

    @GetMapping("/getProductsByCategory/{categoryId}")
    public List<Product> getProductsByCategory(
            @PathVariable Long categoryId) {

        return productService.getProductsByCategory(categoryId);
    }


    // =========================
    // GET PRODUCT BY ID
    // =========================

    @GetMapping("/getProduct/{id}")
    public Product getProductById(
            @PathVariable Long id) {

        return productService.getProductById(id);
    }


    // =========================
    // UPDATE PRODUCT
    // =========================

    @PutMapping("/updateProduct/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @RequestBody Productdto productDTO) {

        return productService.updateProduct(id, productDTO);
    }


    // =========================
    // DELETE PRODUCT
    // =========================

    @DeleteMapping("/deleteProduct/{id}")
    public Product deleteProductById(
            @PathVariable Long id) {

        return productService.deleteProductById(id);
    }


    // =========================
    // GET PRODUCTS ABOVE PRICE
    // =========================

    @GetMapping("/getProductsAbovePrice/{price}")
    public List<Product> getProductsAbovePrice(
            @PathVariable Double price) {

        return productService.getProductsAbovePrice(price);
    }


    // =========================
    // GET PRODUCTS BELOW PRICE
    // =========================

    @GetMapping("/getProductsBelowPrice/{price}")
    public List<Product> getProductsBelowPrice(
            @PathVariable Double price) {

        return productService.getProductsBelowPrice(price);
    }

}