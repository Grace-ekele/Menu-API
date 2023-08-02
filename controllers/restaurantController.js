const resturanTModel = require("../models/restaurantModel")

const createRes = async (req, res) => {
    try
    {

        const {
            businessName,
            address,
            email,
            phoneNumber,
            password
        } = req.body

        
        if (!businessName || !address || !email || !phoneNumber || !password)
        {
            return res.status(400).json({mesage:"please enter all field"})
        }

        const data = await resturanTModel.create({
            businessName,
            address,

            phoneNumber,
            email,
            password
        })

        res.status(201).json({
            message: "Successfully created",
            data: data
        })
        

        
    } catch (erro)
    {
        res.status(404).json({ message: erro.message })
    }
}


module.exports = {
 createRes
}