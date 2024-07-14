# Project Name - Sequelize Models Documentation
This document provides an overview of Sequelize models used in the project, detailing their associations and basic usage.

## Models Overview

1. **User**
   - Represents a user of the system.
   - Associations:
     - Has many Addresses (`User.hasMany(Address)`)
     - Has many Orders (`User.hasMany(Order)`)
     - Has many Reviews (`User.hasMany(Review)`)
     - Has one Cart (`User.hasOne(Cart)`)

2. **Address**
   - Represents a user's address.
   - Associations:
     - Belongs to one User (`Address.belongsTo(User)`)

3. **Cart**
   - Represents a user's shopping cart.
   - Associations:
     - Belongs to one User (`Cart.belongsTo(User)`)
     - Has many CartItems (`Cart.hasMany(CartItem)`)

4. **CartItem**
   - Represents an item in the user's shopping cart.
   - Associations:
     - Belongs to one Cart (`CartItem.belongsTo(Cart)`)
     - Belongs to one Product (`CartItem.belongsTo(Product)`)
     - Belongs to one ProductVariant (`CartItem.belongsTo(ProductVariant)`)

5. **Category**
   - Represents a category of products.
   - Associations:
     - Has many SubCategories (`Category.hasMany(SubCategory)`)

6. **Collection**
   - Represents a collection of products within a subcategory.
   - Associations:
     - Belongs to one SubCategory (`Collection.belongsTo(SubCategory)`)
     - Has many Products (`Collection.hasMany(Product)`)

7. **Order**
   - Represents an order placed by a user.
   - Associations:
     - Belongs to one User (`Order.belongsTo(User)`)
     - Has many OrderItems (`Order.hasMany(OrderItem)`)

8. **OrderItem**
   - Represents an item within an order.
   - Associations:
     - Belongs to one Order (`OrderItem.belongsTo(Order)`)
     - Belongs to one Product (`OrderItem.belongsTo(Product)`)
     - Belongs to one ProductVariant (`OrderItem.belongsTo(ProductVariant)`)

9. **Product**
   - Represents a product within a collection.
   - Associations:
     - Belongs to one Collection (`Product.belongsTo(Collection)`)
     - Has many ProductVariants (`Product.hasMany(ProductVariant)`)
     - Has many Reviews (`Product.hasMany(Review)`)

10. **ProductVariant**
    - Represents a variant of a product.
    - Associations:
      - Belongs to one Product (`ProductVariant.belongsTo(Product)`)
      - Belongs to one Size (`ProductVariant.belongsTo(Size)`)
      - Has many OrderItems (`ProductVariant.hasMany(OrderItem)`)

11. **Review**
    - Represents a review of a product.
    - Associations:
      - Belongs to one Product (`Review.belongsTo(Product)`)
      - Belongs to one User (`Review.belongsTo(User)`)

12. **Size**
    - Represents a size option for a product variant.
    - No direct associations in the provided schema.

13. **SubCategory**
    - Represents a subcategory of products within a category.
    - Associations:
      - Belongs to one Category (`SubCategory.belongsTo(Category)`)
      - Has many Collections (`SubCategory.hasMany(Collection)`)

## Usage

- Each model file (`user.js`, `address.js`, etc.) defines the Sequelize schema and its associations.
- Sequelize migrations and seeders should be used to manage database schema changes and initial data respectively.
- Use Sequelize queries and associations (`include` option) to fetch related data across models efficiently.
