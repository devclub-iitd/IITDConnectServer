/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import News from '../models/news';
import User from '../models/user';
import {Request, Response, NextFunction} from 'express';
import {createError} from '../utils/helpers';




export const getNews = async (req: Request, res: Response) => {
  try {
    // console.log(req.query);
    const queryObject =req.query;

    const queryKeys= Object.keys(queryObject)
    if(queryKeys.length ===0){
      const news = await News.find({}).sort({publDate: 'desc'});
      res.send(news)
    }
    if(queryObject.trending === 'true'){
      const trendNews =await News.find({}).sort({clicks:'desc'})
      res.send(trendNews)
    }
    else{
      throw new Error('Query Not Matched')
    }



  } catch (e) {
    res.status(500).send(e);
  }
};

export const newsDetails =async(req : Request , res: Response)=>{
  try {
    const user =await User.findById(req.payload.id);
    if(!user){
      res.status(401).send({message:'Authentication Failed'});
    }
    const news= await News.findById(req.params.id);
    if(!news){
      throw createError(401,'Doesnot Exists','News for given id donot exists')
    }
    news.clicks+=1;
    await news.save();
    res.send(news)
  } catch (error) {
    res.status(500).send(error)
}
};

export const addNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload.id);
    if (user === null || user.adminOf.length === 0) {
      throw createError(401, 'Unauthorized', 'Invalid Login Credentials');
    }
    const news = new News({
      ...req.body,
      createdBy: user._id,
    });
    await news.save();
    res.send({news});
  } catch (err) {
    next(err);
  }
};

export const deleteNews = async ( req: Request , res : Response )=>{
  try {
    const user=await User.findById(req.payload.id);
    if(user === null || user.adminOf.length === 0){
      throw createError(401, 'Unauthorized', 'Only admins are allowed to delete news');
    }
  await News.findByIdAndDelete(req.params.id);
    res.send({
      message:'News deleted succesfully'
    })
  } catch (error) {
    res.status(500).send(error);
  }
}

export const updateNews = async ( req : Request, res :Response)=>{
  try {
    // verify user
    const user=await User.findById(req.payload.id);
    if(user === null || user.adminOf.length === 0){
      throw createError(401, 'Unauthorized', 'Only admins are allowed to update news');
    }
    // verify allowed fields
    const allowedUpdates=['sourceName','sourceUrl','title','author','description','imgUrl','content'];
    const updates=Object.keys(req.body);
    const isValidOperation= updates.every((update)=> allowedUpdates.includes(update));
    if(!isValidOperation){
      res.send({message:'fields not matched to allowed ones',allowed:allowedUpdates})
    }

    // Finally updating
    await News.findByIdAndUpdate(req.params.id,req.body);
    res.send('News Updated Succesfully');
}catch(err){
  res.status(500).send(err)
}
};

// ?tested Ok
// report News
export const reportNews = async( req : Request , res : Response )=>{
  try {
    const user = await User.findById(req.payload.id);
    if(user === null){
      throw createError(401, 'Unauthorized', 'Authorization Failed');
    }
    const report ={
      ...req.body,
    reporter: user._id ,
  };
    const news = await News.findById(req.params.id);
    if(!news){
      throw createError(401, 'News donot exists','News donot exists');
    }
    news.reports.push(report);

    // save the news object
    await news.save();

    res.send('Report issued successfully');
  } catch (e) {
    res.status(500).send(e) ;
  }
}