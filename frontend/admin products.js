const BASE_URL = "https://buynest-backend-p1s9.onrender.com";


// ==========================================
// EDITING PRODUCT ID
// ==========================================

let editingProductId = null;


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadProducts();

    document
        .getElementById("productForm")
        .addEventListener(
            "submit",
            saveOrUpdateProduct
        );

});


// ==========================================
// GET ALL PRODUCTS
// ==========================================

function loadProducts() {

    fetch(`${BASE_URL}/getProducts`)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to load products"
                );

            }

            return response.json();

        })

        .then(products => {

            const tbody =
                document.getElementById(
                    "productTableBody"
                );

            tbody.innerHTML = "";


            products.forEach(product => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${product.id}
                    </td>


                    <td>

                        <img
                            src="${product.imageUrl || ''}"
                            class="product-image"
                            alt="Product">

                    </td>


                    <td>
                        ${product.name}
                    </td>


                    <td>
                        ₹${product.price}
                    </td>


                    <td>
                        ${product.quantity}
                    </td>


                    <td>
                        ${product.description}
                    </td>


                    <td>
                        ${
                            product.category
                            ? product.category.id
                            : "N/A"
                        }
                    </td>


                    <td>

                        <button
                            class="edit-btn"
                            onclick="editProduct(${product.id})">

                            Edit

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteProduct(${product.id})">

                            Delete

                        </button>

                    </td>

                `;


                tbody.appendChild(row);

            });

        })

        .catch(error => {

            console.error(
                "Error loading products:",
                error
            );

        });

}


// ==========================================
// SAVE OR UPDATE PRODUCT
// ==========================================

function saveOrUpdateProduct(event) {

    event.preventDefault();


    // --------------------------------------
    // COLORS
    // --------------------------------------

    const colorsValue =
        document.getElementById(
            "colors"
        ).value;


    const colors =
        colorsValue
            .split(",")
            .map(color => color.trim())
            .filter(color => color !== "");


    // --------------------------------------
    // PRODUCT DTO
    // --------------------------------------

    const product = {

        name:
            document.getElementById(
                "name"
            ).value.trim(),


        description:
            document.getElementById(
                "description"
            ).value.trim(),


        price:
            Number(
                document.getElementById(
                    "price"
                ).value
            ),


        quantity:
            Number(
                document.getElementById(
                    "quantity"
                ).value
            ),


        imageUrl:
            document.getElementById(
                "imageUrl"
            ).value.trim(),


        colors:
            colors,


        categoryId:
            Number(
                document.getElementById(
                    "categoryId"
                ).value
            )

    };


    console.log(
        "Product being sent:",
        product
    );


    // ======================================
    // UPDATE
    // ======================================

    if (editingProductId !== null) {

        fetch(
            `${BASE_URL}/updateProduct/${editingProductId}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(product)

            }
        )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Failed to update product"
                );

            }

            return response.json();

        })

        .then(data => {

            alert(
                "Product updated successfully!"
            );


            cancelEdit();

            loadProducts();

        })

        .catch(error => {

            console.error(
                "Update error:",
                error
            );

            alert(
                "Failed to update product."
            );

        });


        return;
    }


    // ======================================
    // SAVE
    // ======================================

    fetch(
        `${BASE_URL}/saveProduct`,
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"

            },

            body:
                JSON.stringify(product)

        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to save product"
            );

        }

        return response.json();

    })

    .then(data => {

        alert(
            "Product added successfully!"
        );


        document
            .getElementById(
                "productForm"
            )
            .reset();


        loadProducts();

    })

    .catch(error => {

        console.error(
            "Save error:",
            error
        );

        alert(
            "Failed to add product."
        );

    });

}


// ==========================================
// EDIT PRODUCT
// ==========================================

function editProduct(id) {

    fetch(
        `${BASE_URL}/getProduct/${id}`
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Product not found"
            );

        }

        return response.json();

    })

    .then(product => {


        // Store ID

        editingProductId =
            product.id;


        // Fill form

        document.getElementById(
            "name"
        ).value =
            product.name || "";


        document.getElementById(
            "description"
        ).value =
            product.description || "";


        document.getElementById(
            "price"
        ).value =
            product.price || "";


        document.getElementById(
            "quantity"
        ).value =
            product.quantity || "";


        document.getElementById(
            "imageUrl"
        ).value =
            product.imageUrl || "";


        document.getElementById(
            "categoryId"
        ).value =
            product.category
            ? product.category.id
            : "";


        // Colors

        if (
            product.colors &&
            product.colors.length > 0
        ) {

            document.getElementById(
                "colors"
            ).value =
                product.colors.join(", ");

        } else {

            document.getElementById(
                "colors"
            ).value = "";

        }


        // Change title

        document.getElementById(
            "formTitle"
        ).textContent =
            "Update Product";


        // Change button

        document.getElementById(
            "saveButton"
        ).textContent =
            "Update Product";


        // Show cancel

        document.getElementById(
            "cancelButton"
        ).style.display =
            "inline-block";


        // Scroll to form

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    })

    .catch(error => {

        console.error(
            "Edit error:",
            error
        );

        alert(
            "Unable to load product."
        );

    });

}


// ==========================================
// DELETE PRODUCT
// ==========================================

function deleteProduct(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmation) {

        return;

    }


    fetch(
        `${BASE_URL}/deleteProduct/${id}`,
        {

            method: "DELETE"

        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Failed to delete product"
            );

        }

        return response.json();

    })

    .then(data => {

        alert(
            "Product deleted successfully!"
        );


        loadProducts();

    })

    .catch(error => {

        console.error(
            "Delete error:",
            error
        );

        alert(
            "Failed to delete product."
        );

    });

}


// ==========================================
// CANCEL EDIT
// ==========================================

function cancelEdit() {

    editingProductId = null;


    document
        .getElementById(
            "productForm"
        )
        .reset();


    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Product";


    document.getElementById(
        "saveButton"
    ).textContent =
        "Add Product";


    document.getElementById(
        "cancelButton"
    ).style.display =
        "none";

}