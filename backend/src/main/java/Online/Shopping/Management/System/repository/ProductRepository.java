package Online.Shopping.Management.System.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import Online.Shopping.Management.System.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

// Search products by category ID
List<Product> findByCategoryId(Long categoryId);
// Search products by price
List<Product> findByPriceGreaterThan(Double price);
List<Product> findByPriceLessThan(Double price);
List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
// Search by product name
List<Product> findByNameContainingIgnoreCase(String name);
// Search by name or description
List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
        String name, String description);
// Search by name and maximum price
List<Product> findByNameContainingIgnoreCaseAndPriceLessThan(
        String name, Double price);
// Search by name and minimum price
List<Product> findByNameContainingIgnoreCaseAndPriceGreaterThan(
        String name, Double price);
// Search by name and price range
List<Product> findByNameContainingIgnoreCaseAndPriceBetween(
        String name, Double minPrice, Double maxPrice);
// Search by category and maximum price
List<Product> findByCategoryIdAndPriceLessThan(
        Long categoryId, Double price);
// Search by category and minimum price
List<Product> findByCategoryIdAndPriceGreaterThan(
        Long categoryId, Double price);
// Search by category and price range
List<Product> findByCategoryIdAndPriceBetween(
        Long categoryId, Double minPrice, Double maxPrice);

}