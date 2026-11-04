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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Online.Shopping.Management.System.entity.Orderitem;
import Online.Shopping.Management.System.service.OrderitemService;

import jakarta.validation.Valid;

@RequestMapping("/orderitems")
@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://buynest-frontend-5fyu.onrender.com"
})
public class OrderitemController {

    @Autowired
    private OrderitemService orderitemService;


    // =====================================================
    // SAVE ORDER ITEM
    // =====================================================

    @PostMapping
    public Orderitem saveOrderitem(
            @Valid @RequestBody Orderitem orderitem) {

        return orderitemService.saveOrderitem(orderitem);
    }


    // =====================================================
    // GET ALL ORDER ITEMS
    // =====================================================

    @GetMapping
    public List<Orderitem> getAllOrderitems() {

        return orderitemService.getAllOrderitems();
    }


    // =====================================================
    // GET ORDER ITEM BY ID
    // =====================================================

    @GetMapping("/{id}")
    public Orderitem getOrderitemById(
            @PathVariable Long id) {

        return orderitemService.getOrderitemById(id);
    }


    // =====================================================
    // UPDATE ORDER ITEM
    // =====================================================

    @PutMapping("/{id}")
    public Orderitem updateOrderitem(
            @PathVariable Long id,
            @Valid @RequestBody Orderitem orderitem) {

        return orderitemService.updateOrderitem(id, orderitem);
    }


    // =====================================================
    // DELETE ORDER ITEM
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteOrderitem(
            @PathVariable Long id) {

        orderitemService.deleteOrderitem(id);

        return "Orderitem deleted successfully";
    }
}