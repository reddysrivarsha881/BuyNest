package Online.Shopping.Management.System.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import Online.Shopping.Management.System.dto.Productdto;
import Online.Shopping.Management.System.entity.Category;
import Online.Shopping.Management.System.entity.Product;
import Online.Shopping.Management.System.exception.ResourceNotFoundException;
import Online.Shopping.Management.System.repository.CategoryRepository;
import Online.Shopping.Management.System.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    // =========================
    // SAVE PRODUCT
    // =========================

    public Productdto saveProduct(Productdto productDTO) {

        Product product = new Product();

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setImageUrl(productDTO.getImageUrl());

        // PRODUCT COLORS
        if (productDTO.getColors() != null) {
            product.setColors(
                    new ArrayList<>(productDTO.getColors())
            );
        } else {
            product.setColors(new ArrayList<>());
        }

        // CATEGORY
        if (productDTO.getCategoryId() == null) {
            throw new ResourceNotFoundException(
                    "Category ID cannot be null"
            );
        }

        Category category = categoryRepository
                .findById(productDTO.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"
                        )
                );

        product.setCategory(category);

        // SAVE PRODUCT
        Product savedProduct = productRepository.save(product);

        // RESPONSE DTO
        Productdto response = new Productdto();

        response.setName(savedProduct.getName());
        response.setDescription(savedProduct.getDescription());
        response.setPrice(savedProduct.getPrice());
        response.setQuantity(savedProduct.getQuantity());
        response.setImageUrl(savedProduct.getImageUrl());
        response.setColors(savedProduct.getColors());

        response.setCategoryId(
                savedProduct.getCategory().getId()
        );

        return response;
    }


    // =========================
    // GET ALL PRODUCTS
    // =========================

    public List<Product> getProducts() {

        return productRepository.findAll();
    }


    // =========================
    // GET PRODUCTS BY CATEGORY
    // =========================

    public List<Product> getProductsByCategory(Long categoryId) {

        categoryRepository
                .findById(categoryId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"
                        )
                );

        return productRepository.findByCategoryId(categoryId);
    }


    // =========================
    // GET PRODUCT BY ID
    // =========================

    public Product getProductById(Long id) {

        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );
    }


    // =========================
    // UPDATE PRODUCT
    // =========================

    public Product updateProduct(Long id, Productdto productDTO) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setQuantity(productDTO.getQuantity());
        product.setImageUrl(productDTO.getImageUrl());

        // COLORS
        if (productDTO.getColors() != null) {
            product.setColors(
                    new ArrayList<>(productDTO.getColors())
            );
        } else {
            product.setColors(new ArrayList<>());
        }

        // CATEGORY
        if (productDTO.getCategoryId() == null) {
            throw new ResourceNotFoundException(
                    "Category ID cannot be null"
            );
        }

        Category category = categoryRepository
                .findById(productDTO.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Category not found"
                        )
                );

        product.setCategory(category);

        return productRepository.save(product);
    }


    // =========================
    // DELETE PRODUCT
    // =========================

    public Product deleteProductById(Long id) {

        Product product = productRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Product not found"
                        )
                );

        productRepository.delete(product);

        return product;
    }


    // =========================
    // GET PRODUCTS ABOVE PRICE
    // =========================

    public List<Product> getProductsAbovePrice(Double price) {

        return productRepository.findByPriceGreaterThan(price);
    }


    // =========================
    // GET PRODUCTS BELOW PRICE
    // =========================

    public List<Product> getProductsBelowPrice(Double price) {

        return productRepository.findByPriceLessThan(price);
    }

}