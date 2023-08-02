const router = require('express').Router();

const { createRes} = require("../controllers/restaurantController")

router.route('/create-resturent').post(createRes)
module.exports = router