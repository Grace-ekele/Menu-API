const menuModle = require("../models/menuModel")
const resturanTModel = require("../models/restaurantModel")
const mongoose = require("mongoose");
const cloudinary = require("../middleware/cloudinary");



const createMenu = async (req, res) => {
    try
    {
        
        const { name, price, category } = req.body
         if ( !name || !price || !category )
        {
            return res.status(400).json({mesage:"please enter all field"})
        }
        const findResturant = await resturanTModel.findById(req.params.id)
        
        const image = await cloudinary.uploader.upload(req.file.path)
        
        console.log("res", findResturant)
        if (!findResturant)
        {
            return res.status(401).json({
                message:"restaurant not founf"
            })
        }

        const  menuDaat  = await menuModle.create({
            restaurant:req.params.id,
            name,
            price,
            category,
            itemImage:image.secure_url

        })

        findResturant.menu.push(new mongoose.Types.ObjectId(menuDaat._id))
        findResturant.save()

        menuDaat.restaurant = findResturant._id
        menuDaat.save()

        
        res.status(200).json({
            mesage: "resturant created sucessfully",
            data:menuDaat
        })

        
    } catch (erro)
    {
        res.status(404).json({ message: erro.message })
    }
}


const getOneMenue = async (req,res)=>{
    try {
        const { menuId } = req.params;
        const user = await menuModle.findById(menuId)
        res.json({ user })
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
};


const getAllMenu = async (req, res) => {
    try {
      const menus = await menuModle.find()
      res.json({ menus });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
};


const updateMenu = async (req, res) => {
    try
    {
        
        const { name, price, category } = req.body
        const menu = await menuModle.findById(req.params.id)
        if(req.file){
           const publicId = menu.itemImage.split('/').pop().split('.')[0];
           await cloudinary.destroy(publicId)
            
            const image = await cloudinary.uploader.upload(req.file.path);
            await menuModle.findByIdAndUpdate(req.params.id, {
                itemImage: image.secure_url
            }, {
                new: true
            })
        }
        const  menuDaat  = await menuModle.findByIdAndUpdate(req.params.id, {
            name,
            price,
            category
        }, {
            new:true
        })
         
        res.status(200).json({
            message: menuDaat
        })
        
    } catch (erro)
    {
        res.status(404).json({ message: erro.message })
    }
}


const deleteMenu = async (req,res)=>{
    try{
        await cloudinary.destroy(itemImage)
        const menu =await menyModel.findByIdAndDelete()
        if(!menu){
            res.status(404).json({
                message:"menu not found"
            })
        }else{
            res.status(201).json({
                message:"deleted sucssefully",
                data:menuDaat
            })
        }
    }catch(erro){
        res.status(500).json({
            message:erro.message
        })
    }
}
module.exports = {
    createMenu,
    getOneMenue,
    getAllMenu,
    updateMenu,
    deleteMenu
}


