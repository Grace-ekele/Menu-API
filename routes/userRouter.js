const { checkUser, superAuth, authenticate } = require('../middleware/authorization');
const { userSignUp, userLogin,  signOut, verifyEmail, resendVerificationEmail, forgotPassword, changePassword, resetPassword } = require('../controllers/userController');

const router = require('express').Router();

router.route('/api').get((req, res) => {
    res.json('WELCOME TO MY AUTHENTICATION API HOMEPAGE')
})

router.route('/sign-up').post(userSignUp)

router.route('/log-in').post(userLogin)

router.route('/log-out/:userId').post(authenticate, signOut)

router.route( "/users/verify-email/:token" )
    .get( verifyEmail );

router.route( "/users/resend-verification-email" )
    .post( resendVerificationEmail );
    
router.route('/users/change-password/:token')
.post(changePassword);

router.route('/users/reset-password/:token')
.post(resetPassword);

router.route('/users/forgot-password')
.post(forgotPassword);

// router.route('/delete-self/:userId').delete(authenticate, deleteUser)




module.exports = router