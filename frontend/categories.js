"use strict";

const API_URL = "https://buynest-qbzg.onrender.com/getCategories";

const categoryGrid = document.getElementById("categoryGrid");

const categoryIcons = {
    "fashion": "👗",
    "electronics": "📱",
    "home & kitchen": "🏠",
    "home and kitchen": "🏠",
    "beauty": "💄",
    "footwear": "👟",
    "toys & kids": "🧸",
    "toys and kids": "🧸",
    "books": "📚",
    "grocery": "🛒",
    "sports & fitness": "🏋️",
    "sports and fitness": "🏋️",
    "accessories": "👜"
};
function getCategoriesArray(result) {
if (Array.isArray(result)) {
return result;
}

if (Array.isArray(result?.data)) {
    return result.data;
}
if (Array.isArray(result?.categories)) {
    return result.categories;
}
if (Array.isArray(result?.content)) {
    return result.content;
}
return [];

}

async function loadCategories() {
if (!categoryGrid) {
console.error("Category grid #categoryGrid was not found.");
return;
}

categoryGrid.innerHTML = `
    <p style="grid-column:1/-1;text-align:center;">
        Loading categories...
    </p>
`;
try {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error(`Categories API returned HTTP ${response.status}`);
    }
    const result = await response.json();
    console.log("Categories received:", result);
    const categories = getCategoriesArray(result);
    categoryGrid.replaceChildren();
    if (categories.length === 0) {
        categoryGrid.innerHTML = `
            <p style="grid-column:1/-1;text-align:center;">
                No categories are available.
            </p>
        `;
        return;
    }
    categories.forEach(category => {
        const categoryId = category.id ?? category.categoryId;
        const categoryName =
            category.name ?? category.categoryName ?? category.category_name;
        if (categoryId == null || !categoryName) {
            console.warn("Skipping invalid category:", category);
            return;
        }
        const card = document.createElement("button");
        card.type = "button";
        card.className = "category-card";
        const icon = categoryIcons[categoryName.trim().toLowerCase()] || "🛍️";
        const iconElement = document.createElement("div");
        iconElement.className = "category-icon";
        iconElement.textContent = icon;
        const heading = document.createElement("h2");
        heading.textContent = categoryName;
        const description = document.createElement("p");
        description.textContent = `Explore ${categoryName}`;
        card.append(iconElement, heading, description);
        card.addEventListener("click", () => {
            window.location.href =
                `products.html?categoryId=${encodeURIComponent(categoryId)}`;
        });
        categoryGrid.appendChild(card);
    });
} catch (error) {
    console.error("Error loading categories:", error);
    categoryGrid.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;color:#c0392b;">
            Unable to load categories. Please refresh the page and try again.
        </p>
    `;
}

}

loadCategories();