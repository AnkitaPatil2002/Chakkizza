import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';
import {Select} from 'antd';
import { useNavigate } from 'react-router-dom';

const {Option}=Select;

const CreateProduct = () => {
  const navigate =useNavigate()
  const [categories,setCategories]=useState([]);
  const [photo,setPhoto]=useState("");
  const [name,setName]=useState("");
  const [description,setDescription]=useState("");
  const [price,setPrice]=useState("");
  const [category,setCategory]=useState("");
  const [quantity,setQuantity]=useState("");
  const [shipping,setShiping]=useState("");

  //get all category
  const getAllCategory=async()=>{
    try{
      const {data}=await axios.get('/api/v1/category/get-category')
      if(data?.success){
        setCategories(data?.category);
      }
    }catch(error){
      console.log(error)
      toast.error('something went wrong in getting categories')
    }
  };
  useEffect(()=>{
    getAllCategory();
},[]
);
//create product
  const handleCreate=async(e)=>{
         e.preventDefault()
         try{
          const productData =new FormData()
          productData.append("name",name)
          productData.append("description",description)
          productData.append("price",price)
          productData.append("quantity",quantity)
          productData.append("photo",photo)
          productData.append("shipping",shipping)
          productData.append("category",category)
            const {data} =axios.post('/api/v1/product/create-product',productData)
            if(data?.success){
              toast.error(data?.message)

            }else{
              toast.success('Poduct Created Successfully')
              navigate('/dashboard/admin/product')
            }
         }catch(error){
          console.log(error)
          toast.error('something went wrong')
         }
  }
  return (
    <Layout title={"Dashboard - Create Product"}>
        
        <div className='container-fluid m-3 p-3'>
        <div className='row'>
        <div className='col-md-3'>
            <AdminMenu/>
        </div>
        <div className='col-md-9'>
            <h3>Create Product</h3>
            <div className='m-1 w-75'>
              <Select bordered={false} placeholder="Select a Category" size="large" showSearch className='form-select mb-3' onChange={(value)=>{setCategory(value);}} >
                  {categories?.map((c)=>(
                    <Option key={c._id} value={c._id}>{c.name}</Option>
                  ))}
              </Select>
             <div className='mb-3'>
              <label className='btn btn-outline-secondary col-md-12'>
                {photo? photo.name: "Upload Photo"} 
              <input type="file" name="photo" accept='image/*' onChange={(e)=>setPhoto(e.target.files[0])} hidden/> 
              </label>            
              </div>
              <div className='mb-3'>
                    {photo && (
                      <div className='text-center'>
                        <img src={URL.createObjectURL(photo)} alt="product photo" height={'200px'} className='img img-responsive'/>                     </div>
                    )}
              </div>
              <div className='mb-3'>
                <input type="text" value={name} placeholder='write a name' className='form-control' onChange={(e)=>setName(e.target.value)}/>
              </div>
              <div className='mb-3'>
                <textarea type="" value={description} placeholder='Description' className='form-control' onChange={(e)=>setDescription(e.target.value)}></textarea>
                
              </div>
              <div className='mb-3'>
                <input type="Number" value={price} placeholder='write a price' className='form-control' onChange={(e)=>setPrice(e.target.value)}/>
              </div>
              <div className='mb-3'>
                <input type="Number" value={quantity} placeholder='write a quantity' className='form-control' onChange={(e)=>setQuantity(e.target.value)}/>
              </div>
              <div className='mb-3'>
                <Select bordered={false} placeholder='select shipping' size="large" showSearch className='form-select mb-3' onChange={(value)=>{setShiping(value);}}>
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className='mb-3'>
                <button className='btn btn-primary' onClick={handleCreate}>CREATE PRODUCT</button>
              </div>
            </div>
        </div>
        </div>
        </div>
    </Layout>
  )
}

export default CreateProduct