import Product from '../models/Product.js';
import redis from '../lib/redis.js';
import cloudinary from '../lib/cloudinary.js';
import dotenv from 'dotenv';
dotenv.config();


export const getAllProducts = async (req, res)=> {
   try {
     const products = await Product.find();
   res.json(products);
   } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Server error");   
   }
}

export const getFeaturedProducts = async (req, res)=> {
    try {
        let featuredProducts = await redis.get('featured_products');
        if (featuredProducts) {
            console.log('Fetching featured products from Redis cache');
            return res.status(200).json(JSON.parse(featuredProducts));
        }
        console.log('Fetching featured products from database');
        featuredProducts = Product.find({ isFeatured: true }).lean;
        if (featuredProducts.length === 0) {
            return res.status(404).json({ message: "No featured products found" });
        }
        await redis.set('featured_products', JSON.stringify(featuredProducts));
        res.status(200).json(featuredProducts);

    } catch (error) {
        console.error("Error fetching featured products:", error);
        res.status(500).send("Server error");
}       
}

export const getProductsByCategory = async (req, res)=> {
    try {
        const category = req.params.category;
        const products = await Product.find({ category
: category });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found in this category" });
        }   
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).send("Server error");
    }
}



export const getProductById = async (req, res)=> {
    
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).send("Server error");
    }
}   
export const addProduct = async (req, res)=> {
     try {
           const { name, description, price, category, image, stock } = req.body;

         // Validate required fields
         if (!name || !description || !price || !category || !image || !stock) {
             return res.status(400).json({
                 error: "Missing required fields",
                 message: "Please provide all required fields: name, description, price, category, image"
             });
         }

         // Validate price is a positive number
         if (isNaN(price) || price < 0) {
             return res.status(400).json({
                 error: "Invalid price",
                 message: "Price must be a valid positive number"
             });
         }

         // Validate stock
         if (stock !== undefined && (isNaN(stock) || stock < 0)) {
             return res.status(400).json({
                 error: "Invalid stock",
                 message: "Stock must be a valid non-negative number"
             });
         }

         let cloudinaryResponse = null;
         try {
             if (image) {
                 cloudinaryResponse = await cloudinary.uploader.upload(image, {
                     folder: 'products'
                 });
             }
         } catch (cloudinaryError) {
             console.error("Cloudinary upload error:", cloudinaryError);
             return res.status(400).json({
                 error: "Image upload failed",
                 message: "Failed to upload product image"
             });
         }

         const newProduct = new Product({
             name,
             description,
             price: parseFloat(price),
             category,
             stock: stock || 0,
             image: cloudinaryResponse?.secure_url || ''
         });

         await newProduct.save();
         console.log("Product saved successfully:", newProduct._id);

         res.status(201).json({
             message: "Product added successfully",
             product: newProduct,
             success: true
         });

     } catch (error) {
         console.error("Error adding product:", error);

         // Handle mongoose validation errors
         if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(err => err.message);
             return res.status(400).json({
                 error: "Validation failed",
                 message: messages.join(', ')
             });
         }

         res.status(500).json({
             error: "Internal server error",
             message: "An unexpected error occurred while creating the product"
         });
     }
}

export const updateProduct = async (req, res)=> {
    // Logic to update a product by ID
}   
export const deleteProduct = async (req, res)=> {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }    
        if (product.image){
            const publicId = product.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`haleemmedicose/products/${publicId}`);   

        }
        await product.deleteOne();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send("Server error");
    }   
}   

// Additional functions for product management can be added here
export const getRecommendedProducts = async (req, res) => {
    // Logic to get recommended products based on user preferences or browsing history
        try {
            const products = await Product.aggregate([
                { $sample: { size: 3 } }, 
                {
                $project: { 
                    _id: 1,
                    name: 1,
                    price: 1,
                    image: 1 ,       
                    description: 1
                }
            }
            ])
            console.log(products)
            res.status(200).json(products);

        }catch (error) {
            console.error("Error fetching recommended products:", error);
            res.status(500).send("Server error");
        }   
        

}


export const setFeaturedProduct  = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }   
        product.isFeatured = !product.isFeatured;
        await product.save();
        await updateFeaturedProductsCache();
        res.status(200).json({ message: `Product ${product.isFeatured ? 'set as' : 'removed from'} featured successfully`, product });
    } catch (error) {
        console.error("Error setting featured product:", error);
        res.status(500).send("Server error");
    }
}

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set('featured_products', JSON.stringify(featuredProducts));
        console.log('Featured products cache updated');
    }
    catch (error) {
        console.error("Error updating featured products cache:", error);
    }
}