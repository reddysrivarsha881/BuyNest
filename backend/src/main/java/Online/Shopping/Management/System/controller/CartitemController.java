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

import Online.Shopping.Management.System.dto.Cartitemdto;
import Online.Shopping.Management.System.entity.Cartitem;
import Online.Shopping.Management.System.service.CartitemService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://buynest-frontend-5fyu.onrender.com"
})
public class CartitemController {

    @Autowired
    private CartitemService cartitemService;


    // =====================================================
    // SAVE CART ITEM
    // =====================================================

    @PostMapping("/saveCartitem")
    public Cartitem saveCartitem(
            @Valid @RequestBody Cartitemdto dto) {

        return cartitemService.saveCartitem(dto);
    }


    // =====================================================
    // GET ALL CART ITEMS
    // =====================================================

    @GetMapping("/getCartitems")
    public List<Cartitem> getAllCartitems() {

        return cartitemService.getAllCartitems();
    }


    // =====================================================
    // GET CART ITEMS BY USER
    // =====================================================

    @GetMapping("/getCartitems/{userId}")
    public List<Cartitem> getCartitemsByUser(
            @PathVariable Long userId) {

        return cartitemService.getCartitemsByUser(userId);
    }


    // =====================================================
    // GET CART ITEM BY ID
    // =====================================================

    @GetMapping("/getCartitem/{id}")
    public Cartitem getCartitemById(
            @PathVariable Long id) {

        return cartitemService.getCartitemById(id);
    }


    // =====================================================
    // UPDATE CART ITEM
    // =====================================================

    @PutMapping("/updateCartitem/{id}")
    public Cartitem updateCartitem(
            @PathVariable Long id,
            @Valid @RequestBody Cartitemdto dto) {

        return cartitemService.updateCartitem(id, dto);
    }


    // =====================================================
    // DELETE CART ITEM
    // =====================================================

    @DeleteMapping("/deleteCartitem/{id}")
    public String deleteCartitem(
            @PathVariable Long id) {

        cartitemService.deleteCartitem(id);

        return "Cartitem deleted successfully";
    }

}