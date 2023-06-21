import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { createProductController,getProductController,getSingleProductController,
    productPhotoController,deleteProductController,updateProductController,
    productsFilterController,productCountController,productListController,searchProductController,relatedProductController,productCategoryController} from '../controllers/productController.js'
import formidable from 'express-formidable';

const router = express.Router()

//router
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

//get products
router.get('/get-product',getProductController)

//single product
router.get("/get-product/:slug",getSingleProductController)

//get photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/delete-product/:pid',requireSignIn,isAdmin,deleteProductController)

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)

//filter product
router.post('/product-filters',productsFilterController)

//product count
router.get('/product-count',productCountController)

//product per page
router.get('/product-list/:page',productListController)

//search product 
router.get('/search/:keyword',searchProductController)

//similer product
router.get('/related-product/:pid/:cid',relatedProductController)

//category wise product
router.get('/product-category/:slug',productCategoryController)

export default router