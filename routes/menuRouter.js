const router = require('express').Router();

const { 
    createMenu,
    getOneMenue,
    getAllMenu,
    updateMenu,
    deleteMenu } = require("../controllers/menuController")
const upload = require("../middleware/multer");

router.route('/:id/create-menu').post(upload, createMenu)
router.route('/getOne/:id').get(getOneMenue)
router.route('/getAll').get(getAllMenu )
router.route('/update/:id').put(upload,updateMenu )
router.route('/delete').delete(deleteMenu )



module.exports = router