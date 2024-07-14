const { Cart, CartItem, Product, ProductVariant } = require('../models'); // Adjust the path as necessary

const addItemToCart = async (req, res) => {
    try {
        const { product, productVariant, quantity } = req.body;
        if (req.isGuest) {
            let cart = req.session.cart || { items: [], totalPrice: 0 };
            const existingItem = cart.items.find(item => item.product === product && item.productVariant === productVariant);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product, productVariant, quantity });
            }
            req.session.cart = cart;
            res.status(201).json(cart);
        } else {
            const userId = req.user.id;
            let cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem }] });
            if (!cart) {
                cart = await Cart.create({ userId });
            }
            const existingItem = cart.items.find(item => item.product === product && item.productVariant === productVariant);
            if (existingItem) {
                existingItem.quantity += quantity;
                await existingItem.save();
            } else {
                const productObj = await Product.findByPk(product);
                const productVariantObj = await ProductVariant.findByPk(productVariant);
                const cartItem = await CartItem.create({ cartId: cart.id, productId: product, productVariantId: productVariant, quantity });
                cart.items.push(cartItem);
            }
            res.status(201).json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message, message: 'Error Adding Product' });
    }
};

const getCart = async (req, res) => {
    try {
        if (req.isGuest) {
            const cart = req.session.cart || { items: [], totalPrice: 0 };
            res.json(cart);
        } else {
            const userId = req.user.id;
            const cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, include: [Product, ProductVariant] }] });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        if (req.isGuest) {
            let cart = req.session.cart || { items: [], totalPrice: 0 };
            cart.items = cart.items.filter(item => item._id !== itemId);
            req.session.cart = cart;
            res.json({ message: 'Item removed from cart' });
        } else {
            const userId = req.user.id;
            const cart = await Cart.findOne({ where: { userId } });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            await CartItem.destroy({ where: { id: itemId } });
            res.json({ message: 'Item removed from cart' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCartItemQuantity = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { increment } = req.body;
        if (req.isGuest) {
            let cart = req.session.cart || { items: [], totalPrice: 0 };
            const item = cart.items.find(item => item._id === itemId);
            if (item) {
                if (increment) {
                    item.quantity += 1;
                } else {
                    item.quantity -= 1;
                    if (item.quantity <= 0) {
                        cart.items = cart.items.filter(item => item._id !== itemId);
                    }
                }
            }
            req.session.cart = cart;
            res.json(cart);
        } else {
            const userId = req.user.id;
            const cartItem = await CartItem.findByPk(itemId);
            if (!cartItem) {
                return res.status(404).json({ message: 'Cart item not found' });
            }
            if (increment) {
                cartItem.quantity += 1;
            } else {
                cartItem.quantity -= 1;
                if (cartItem.quantity <= 0) {
                    await cartItem.destroy();
                    return res.json({ message: 'Item removed from cart' });
                }
            }
            await cartItem.save();
            const cart = await Cart.findOne({ where: { userId }, include: [{ model: CartItem, include: [Product, ProductVariant] }] });
            res.json(cart);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addItemToCart,
    getCart,
    removeItemFromCart,
    updateCartItemQuantity
};
