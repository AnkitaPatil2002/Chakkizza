import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import fs from 'fs';

export const createProductController = async(req,res)=>{
    try{
        const {name, slug , description,price,category,quantity,shipping}=req.fields;
        const {photo}=req.files;
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required'});
            case !description:
                return res.status(500).send({error:'Description is required'});
            case !price:
                return res.status(500).send({error:'Price is required'});
            case !category:
                return res.status(500).send({error:'Category is required'});
            case !quantity:
                return res.status(500).send({error:'Quantity is required'});
            case photo && photo.size > 100000:
                return res.status(500).send({error:'photo is required and should be less than 1 mb'})
            
        }
          const products = new productModel({...req.fields,slug:slugify(name)})
          if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
          }
          await products.save()
          res.status(201).send({
            success:true,
            message:'Product Created Successfully',
            products,
          });
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in creating product'
        })
    }
};

//get all products
export const getProductController=async(req,res)=>{
    try{
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            total :products.length,
            message:"All Products",
            products,
            
        });
    }catch(error){
        console.log(error)
        res.status(500).send(
            {
                success:false,
                message:'Error in getting all products',
                error:error.message
            }
        )
    }
}

//get single product controller
export const getSingleProductController=async(req,res)=>{
       try{
          const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
          res.status(200).send(
            {
                success:true,
                message:'Single product fatched',
                product,
            }
          )
       }catch(error){
        console.log(error)
        res.status(500).send(
            {
                success:false,
                message:'Error while getting single product',
                error:error.message,
            }
        )
       }
}
//get photo
export const productPhotoController =async(req,res)=>{
      try{
         const product = await productModel.findById(req.params.pid).select("photo");
         if(product.photo.data){
            res.set('Content-type',product.photo.contentType);
            return res.status(200).send(product.photo.data);
         }
      }catch(error){
        console.log(error)
        res.status(500).send(
            {
                success:false,
                message:'failed to get photo',
                error,
            }
        )
      }
}

//delete controller
export const deleteProductController = async(req,res)=>{
        try{
            await productModel.findByIdAndDelete(req.params.pid).select("-photo");
            res.status(200).send(
                {
                    success:true,
                    message:"Product deleted Successfully!"
                }
            )
        }
        catch(error){
            console.log(error)
            res.status(500).send(
                {
                    success:false,
                    message:'failed to get photo',
                    error,
                })
        }
}
//update product
export const updateProductController=async(req,res)=>{
    try{
        const {name, slug , description,price,category,quantity,shipping}=req.fields;
        const {photo}=req.files;
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is required'});
            case !description:
                return res.status(500).send({error:'Description is required'});
            case !price:
                return res.status(500).send({error:'Price is required'});
            case !category:
                return res.status(500).send({error:'Category is required'});
            case !quantity:
                return res.status(500).send({error:'Quantity is required'});
            case photo && photo.size > 100000:
                return res.status(500).send({error:'photo is required and should be less than 1 mb'})
            
        }
          const products = await productModel.findByIdAndUpdate(req.params.pid,{
            ...req.fields,slug:slugify(name)},{new:true})
          if(photo){
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType=photo.type
          }
          await products.save()
          res.status(201).send({
            success:true,
            message:'Product Updated Successfully',
            products,
          });
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Error in updating product'
        })
    }

}
//filters
export const productsFilterController=async(req,res)=>{
    try{
       const {checked,radio}=req.body
       let args={}
       if(checked.length>0) args.category=checked
       if(radio.length) args.price={$gte: radio[0],$lte:radio[1]}
       const products=await productModel.find(args)
       res.status(200).send({
        success:true,
        products,
       })
    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            error,
            message:'cant get filters something wrong'
        })
    }
}

//product count
export const productCountController=async(req,res)=>{
    try{
       const total = await productModel.find({}).estimatedDocumentCount()
       res.status(200).send(
        {
            success:true,
            total,

        }
       )
    }catch(error){
        console.log(error)
        res.status(400).send({
            message:'Error in product count',
            error,
            success:false
        })
    }
};
//product list base on page
export const productListController=async(req,res)=>{
    try{
       const perPage= 6
       const page= req.params.page?req.params.page:1
       const products= await productModel
       .find({})
       .select("-photo")
       .skip((page-1)*perPage)
       .limit(perPage)
       .sort({createdAt:-1})
       res.status(200).send({
        success:true,
        products,
       });
    }catch(error){
        console.log(error)
        res.status(400).send({
        message:'Error in per page ctrl',
        error,
        success:false})
    }
}
//search product 
export const searchProductController=async(req,res)=>{
    try{
       const {keyword}=req.params
       const results =await productModel.find({
        $or:[
            {  name:{$regex :keyword,$options:"i"}},
            {  description:{$regex :keyword,$options:"i"}}
        ]
       }).select("-photo")
       res.json(results);
    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
        message:'Error In Search Product Api'        })
    }
}

//similer product 
export const relatedProductController=async(req,res)=>{
         try{
             const {pid,cid}=req.params; 
             const products=await productModel.find({
                category:cid,
                _id:{ $ne :pid },
             }).select("-photo").limit(3).populate("category");
             res.status(200).send({
                success:true,
                products,
             });
         }catch(error){
             console.log(error)
             res.status(400).send({
                success:false,
                message:'error while getting related product ',
                error,
             });
         }
};
//get product by category
export const productCategoryController=async(req,res)=>{
    try{
        const category = await categoryModel.findOne({slug:req.params.slug})
        const product =await productModel.find({category}).populate('category')
        res.status(200).send({
            success:true,
            category,
            product,
        })
    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error while getting product category wise',
            error

        })
    }
}