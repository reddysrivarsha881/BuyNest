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

import Online.Shopping.Management.System.dto.Buynowrequest;
import Online.Shopping.Management.System.dto.ResponseStructure;
import Online.Shopping.Management.System.entity.Order;
import Online.Shopping.Management.System.service.OrderService;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://buynest-frontend-5fyu.onrender.com"
})
public class OrderControlller {

    @Autowired
    private OrderService orderService;


    // =====================================================
    // SAVE ORDER
    // =====================================================

    @PostMapping("/saveorder")
    public ResponseStructure<Order> saveOrder(
            @Valid @RequestBody Order order) {

        return orderService.saveOrder(order);
    }


    // =====================================================
    // BUY NOW
    // =====================================================

    @PostMapping("/buynow")
    public ResponseStructure<Order> buyNow(
            @RequestBody Buynowrequest request) {

        return orderService.buyNow(request);
    }


    // =====================================================
    // GET ALL ORDERS
    // =====================================================

    @GetMapping("/getorders")
    public ResponseStructure<List<Order>> getOrders() {

        return orderService.getOrders();
    }


    // =====================================================
    // GET ORDERS BY CUSTOMER ID
    // =====================================================

    @GetMapping("/getorders/user/{userId}")
    public ResponseStructure<List<Order>> getOrdersByUserId(
            @PathVariable Long userId) {

        return orderService.getOrdersByUserId(userId);
    }


    // =====================================================
    // GET ORDER BY ID
    // =====================================================

    @GetMapping("/getorder/{id}")
    public ResponseStructure<Order> getOrderById(
            @PathVariable Long id) {

        return orderService.getOrderById(id);
    }


    // =====================================================
    // UPDATE ORDER
    // =====================================================

    @PutMapping("/updateorder/{id}")
    public ResponseStructure<Order> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody Order order) {

        return orderService.updateOrder(id, order);
    }


    // =====================================================
    // DELETE ORDER
    // =====================================================

    @DeleteMapping("/deleteorder/{id}")
    public ResponseStructure<Order> deleteOrderById(
            @PathVariable Long id) {

        return orderService.deleteOrderById(id);
    }

}