// ==============================================
// PRODUCT INVENTORY & ANALYTICS DASHBOARD
// WITH LOCAL STORAGE
// ==============================================


// ==============================================
// 1. LOAD PRODUCTS FROM LOCAL STORAGE
// ==============================================

// Get saved products
let savedProducts = localStorage.getItem("products");

let products;


// If products already exist in localStorage
if (savedProducts) {

    products = JSON.parse(savedProducts);

} else {

    // Default products
    products = [
        {
            id: 1,
            name: "Laptop",
            price: 800,
            quantity: 1
        },

        {
            id: 2,
            name: "Mouse",
            price: 25,
            quantity: 1
        }
    ];

    // Save default products
    saveProducts();
}


// ==============================================
// 2. SAVE PRODUCTS TO LOCAL STORAGE
// ==============================================

function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );
}


// ==============================================
// 3. GET PRODUCT CATEGORY
// ==============================================

function getCategory(price) {

    let categoryCode;


    // IF ELSE

    if (price < 50) {

        categoryCode = 1;

    } else if (price < 500) {

        categoryCode = 2;

    } else {

        categoryCode = 3;

    }


    // SWITCH

    switch (categoryCode) {

        case 1:
            return "Budget";

        case 2:
            return "Standard";

        case 3:
            return "Premium";

        default:
            return "Unknown";
    }
}


// ==============================================
// 4. ADD PRODUCT
// ==============================================

function addProduct() {

    let name =
        document
            .getElementById("productName")
            .value
            .trim();


    let price =
        Number(
            document
                .getElementById("productPrice")
                .value
        );


    let quantity =
        Number(
            document
                .getElementById("productQuantity")
                .value
        );


    let message =
        document.getElementById("message");


    // ==========================================
    // VALIDATION
    // ==========================================

    if (name === "") {

        message.innerText =
            "Please enter product name.";

        message.style.color = "red";

        return;
    }


    if (
        isNaN(price) ||
        price <= 0
    ) {

        message.innerText =
            "Please enter a valid product price.";

        message.style.color = "red";

        return;
    }


    if (
        isNaN(quantity) ||
        quantity <= 0
    ) {

        message.innerText =
            "Please enter a valid quantity.";

        message.style.color = "red";

        return;
    }


    // ==========================================
    // CREATE PRODUCT OBJECT
    // ==========================================

    const newProduct = {

        id: Date.now(),

        name: name,

        price: price,

        quantity: quantity
    };


    // Add product to array
    products.push(newProduct);


    // ==========================================
    // SAVE TO LOCAL STORAGE
    // ==========================================

    saveProducts();


    // Success message

    message.innerText =
        `${name} added successfully!`;

    message.style.color = "green";


    // ==========================================
    // CLEAR INPUT FIELDS
    // ==========================================

    document.getElementById(
        "productName"
    ).value = "";


    document.getElementById(
        "productPrice"
    ).value = "";


    document.getElementById(
        "productQuantity"
    ).value = "";


    // Refresh UI

    displayProducts();

    updateAnalytics();

    generateReport();
}


// ==============================================
// 5. DISPLAY PRODUCTS
// ==============================================

function displayProducts() {

    const table =
        document.getElementById(
            "productTable"
        );


    const searchValue =
        document.getElementById(
            "searchInput"
        )
        .value
        .toLowerCase();


    const selectedCategory =
        document.getElementById(
            "categoryFilter"
        ).value;


    // Clear old table
    table.innerHTML = "";


    // ==========================================
    // FILTER PRODUCTS
    // ==========================================

    const filteredProducts =
        products.filter(
            (product) => {


                let matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(
                            searchValue
                        );


                let category =
                    getCategory(
                        product.price
                    );


                let matchesCategory =
                    selectedCategory === "All" ||
                    category === selectedCategory;


                return (
                    matchesSearch &&
                    matchesCategory
                );
            }
        );


    // ==========================================
    // NO PRODUCTS
    // ==========================================

    if (
        filteredProducts.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-message"
                >

                    No products found.

                </td>

            </tr>

        `;

        return;
    }


    // ==========================================
    // DISPLAY USING FOREACH
    // ==========================================

    filteredProducts.forEach(
        (product, index) => {


            let category =
                getCategory(
                    product.price
                );


            let totalProductValue =
                product.price *
                product.quantity;


            table.innerHTML += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>


                    <td>
                        ${product.name}
                    </td>


                    <td>
                        $${product.price.toFixed(2)}
                    </td>


                    <td>
                        ${product.quantity}
                    </td>


                    <td>
                        $${totalProductValue.toFixed(2)}
                    </td>


                    <td>

                        <span
                            class="badge ${category.toLowerCase()}"
                        >

                            ${category}

                        </span>

                    </td>


                    <td>

                        <button
                            class="delete-btn"
                            onclick="deleteProduct(${product.id})"
                        >

                            Delete

                        </button>

                    </td>

                </tr>

            `;

        }
    );
}


// ==============================================
// 6. DELETE PRODUCT
// ==============================================

function deleteProduct(id) {

    let confirmation =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmation) {

        return;
    }


    // FILTER removes selected product

    products =
        products.filter(
            (product) =>
                product.id !== id
        );


    // ==========================================
    // UPDATE LOCAL STORAGE
    // ==========================================

    saveProducts();


    // Refresh page

    displayProducts();

    updateAnalytics();

    generateReport();
}


// ==============================================
// 7. CLEAR ALL INVENTORY
// ==============================================

function clearInventory() {

    if (
        products.length === 0
    ) {

        alert(
            "Inventory is already empty."
        );

        return;
    }


    let confirmation =
        confirm(
            "Are you sure you want to delete all products?"
        );


    if (confirmation) {

        // Empty array
        products = [];


        // ======================================
        // UPDATE LOCAL STORAGE
        // ======================================

        saveProducts();


        // Refresh UI

        displayProducts();

        updateAnalytics();

        generateReport();
    }
}


// ==============================================
// 8. CALCULATE TOTAL INVENTORY VALUE
// STANDARD FUNCTION
// ==============================================

function calculateTotal() {

    let total = 0;


    products.forEach(
        function(product) {

            total +=
                product.price *
                product.quantity;

        }
    );


    return total;
}


// ==============================================
// 9. CALCULATE AVERAGE PRICE
// ARROW FUNCTION
// ==============================================

const calculateAveragePrice = () => {

    if (
        products.length === 0
    ) {

        return 0;
    }


    let totalPrice = 0;


    products.forEach(
        (product) => {

            totalPrice +=
                product.price;

        }
    );


    return (
        totalPrice /
        products.length
    );
};


// ==============================================
// 10. UPDATE ANALYTICS
// ==============================================

function updateAnalytics() {


    // ==========================================
    // TOTAL PRODUCTS
    // ==========================================

    document.getElementById(
        "totalProducts"
    ).innerText =
        products.length;


    // ==========================================
    // TOTAL INVENTORY VALUE
    // ==========================================

    let total =
        calculateTotal();


    document.getElementById(
        "totalValue"
    ).innerText =
        "$" + total.toFixed(2);


    // ==========================================
    // AFFORDABLE PRODUCTS
    // Price below $200
    // ==========================================

    let affordableProducts =
        products.filter(
            (product) =>
                product.price < 200
        );


    document.getElementById(
        "affordableCount"
    ).innerText =
        affordableProducts.length;


    // ==========================================
    // AVERAGE PRICE
    // ==========================================

    let average =
        calculateAveragePrice();


    document.getElementById(
        "averagePrice"
    ).innerText =
        "$" + average.toFixed(2);


    // ==========================================
    // CATEGORY COUNTERS
    // ==========================================

    let budget = 0;

    let standard = 0;

    let premium = 0;


    products.forEach(
        (product) => {


            let category =
                getCategory(
                    product.price
                );


            if (
                category === "Budget"
            ) {

                budget++;

            } else if (
                category === "Standard"
            ) {

                standard++;

            } else if (
                category === "Premium"
            ) {

                premium++;
            }

        }
    );


    // Display counts

    document.getElementById(
        "budgetCount"
    ).innerText =
        budget;


    document.getElementById(
        "standardCount"
    ).innerText =
        standard;


    document.getElementById(
        "premiumCount"
    ).innerText =
        premium;
}


// ==============================================
// 11. MAP() PRODUCT REPORT
// ==============================================

function generateReport() {

    const report =
        products.map(
            (product) => {

                return (
                    product.name.toUpperCase() +
                    ": $" +
                    product.price
                );

            }
        );


    console.log(
        "Formatted Report List:",
        report
    );
}


// ==============================================
// 12. LOOP + BREAK + CONTINUE
// ==============================================

function searchExpensiveProduct() {

    for (
        let i = 0;
        i < products.length;
        i++
    ) {


        // Skip invalid product

        if (
            products[i].price <= 0
        ) {

            continue;
        }


        // Find first premium product

        if (
            products[i].price >= 500
        ) {

            console.log(
                "First Premium Product:",
                products[i].name
            );


            // Stop loop
            break;
        }
    }
}


// ==============================================
// 13. INITIALIZE APPLICATION
// ==============================================

displayProducts();

updateAnalytics();

generateReport();

searchExpensiveProduct();