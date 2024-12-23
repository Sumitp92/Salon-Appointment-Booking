const express = require('express') ; 
const router = express.Router() ; 
const {AddUser , LoginUser} = require('../controllers/users') ; 

router.post('/signup' , AddUser) ; 
router.post('/login',   LoginUser) ; 


module.exports = router ; 