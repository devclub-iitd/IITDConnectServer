// import modules 
import * as express from 'express';
import {check} from 'express-validator/check';

import {
    getNews,
} from '../../controllers/news'

const router=express.Router() ;
import auth from '../../middleware/auth'



 
// endpoints


//  get all the events??
router.get('/news',auth.required,getNews);
 
router.post('/news',auth.required,(req,res)=>{

});

router.delete('/news',auth.required,(req,res)=>{
    
});