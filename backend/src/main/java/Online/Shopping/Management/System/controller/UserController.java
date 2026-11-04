package Online.Shopping.Management.System.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import Online.Shopping.Management.System.dto.ResponseStructure;
import Online.Shopping.Management.System.dto.Userdto;
import Online.Shopping.Management.System.entity.User;
import Online.Shopping.Management.System.service.Userservice;

import jakarta.validation.Valid;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://buynest-frontend-5fyu.onrender.com"
})
public class UserController {

    @Autowired
    private Userservice userService;

    // SAVE USER
    @PostMapping("/saveUser")
    public ResponseStructure<User> saveUser(
            @Valid @RequestBody User user) {

        return userService.saveUser(user);
    }

    // CUSTOMER LOGIN
    @PostMapping("/login")
    public User login(@RequestBody User user) {

        return userService.login(
                user.getEmail(),
                user.getPassword()
        );
    }

    // GET ALL USERS
    @GetMapping("/getUsers")
    public List<User> getUsers() {

        return userService.getUsers();
    }

    // GET USER BY ID
    @GetMapping("/getUser/{id}")
    public User getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    // UPDATE USER
    @PutMapping("/updateUser/{id}")
    public User updateUser(
            @PathVariable Long id,
            @Valid @RequestBody Userdto userDTO) {

        return userService.updateUser(id, userDTO);
    }

    // DELETE USER
    @DeleteMapping("/deleteUser/{id}")
    public User deleteUserById(
            @PathVariable Long id) {

        return userService.deleteUserById(id);
    }
}