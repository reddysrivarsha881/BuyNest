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
import Online.Shopping.Management.System.entity.Cart;
import Online.Shopping.Management.System.service.CartService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://buynest-frontend-5fyu.onrender.com"
})
public class CartController {

    @Autowired
    private CartService cartService;


    // =========================
    // SAVE CART
    // =========================

    @PostMapping("/saveCart")
    public ResponseStructure<Cart> saveCart(
            @Valid @RequestBody Cart cart) {

        return cartService.saveCart(cart);
    }


    // =========================
    // GET ALL CARTS
    // =========================

    @GetMapping("/getcarts")
    public ResponseStructure<List<Cart>> getCarts() {

        return cartService.getCarts();
    }


    // =========================
    // GET CART BY ID
    // =========================

    @GetMapping("/getcart/{id}")
    public ResponseStructure<Cart> getCartById(
            @PathVariable Long id) {

        return cartService.getCartById(id);
    }


    // =========================
    // UPDATE CART
    // =========================

    @PutMapping("/updatecart/{id}")
    public ResponseStructure<Cart> updateCart(
            @PathVariable Long id,
            @Valid @RequestBody Cart cart) {

        return cartService.updateCart(id, cart);
    }


    // =========================
    // DELETE CART
    // =========================

    @DeleteMapping("/deletecart/{id}")
    public ResponseStructure<Cart> deleteCartById(
            @PathVariable Long id) {

        return cartService.deleteCartById(id);
    }

}