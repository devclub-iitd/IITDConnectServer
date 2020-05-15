import News from '../models/news';
import User from '../models/user';
import {Request, Response, NextFunction} from 'express';
import {createError} from '../utils/helpers';

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find({}).sort({publDate: 'desc'});
    // get all news
    res.send(news);
  } catch (e) {
    res.status(500).send(e);
  }
};

export const addNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload.id);
    if (user === null) {
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
