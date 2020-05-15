  import News from '../models/news'
  import User from '../models/user'
  import * as express from 'express'
import { userInfo } from 'os'



 export const getNews = async(req,res)=>{
    try{
    const news= await News.find({}).sort({publDate:'desc'})
    // get all news
    res.send(news)

    }catch(e){
        res.status(500).send(e)
    }

}

export const addNews = async(req,res)=>{
    const user =await User.findById(req.payload.id)
    if(user.adminOf==null){
        throw new Error
    }
    try {
        const news=new News({
            ...req.body,
            createdBy:user._id
        })

        await news.save()
        res.send({news})

    } catch (e) {
     res.status(500).send(e)   
    }
};
