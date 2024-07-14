const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes')
const collectionRoutes = require('./routes/collectionRoutes')
const sizeRoutes = require('./routes/sizeRoutes');
const ProductVariantRoutes = require('./routes/productVariantRoutes');
const productRoutes = require('./routes/productRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes')
const cartRoutes = require('./routes/cartRoutes')
// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(session({
    secret: `${process.env.SESSION_KEY}`,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use 'true' in production with HTTPS
}));

// Routes
app.use('/auth', authRoutes); // Mount authRoutes under /api/auth path
app.use('/categories', categoryRoutes);
app.use('/collections', collectionRoutes);
app.use('/sizes', sizeRoutes)
app.use('/productVariant', ProductVariantRoutes)
app.use('/products', productRoutes)
app.use('/cart', cartRoutes)
app.use('/sub-category', subCategoryRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
