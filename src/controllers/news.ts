import News from '../models/news';
import User from '../models/user';
import {Request, Response, NextFunction} from 'express';
import {createError, createResponse} from '../utils/helpers';

export const getNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.query);
    const queryObject = req.query;

    const queryKeys = Object.keys(queryObject);
    if (queryKeys.length === 0) {
      const news = await News.find({}).sort({publDate: 'desc'});
      res.send(createResponse('Recent News', news));
    }
    if (queryObject.trending === 'true') {
      const trendNews = await News.find({}).sort({clicks: 'desc'});
      res.send(createResponse('Trending News', trendNews));
    } else {
      throw new Error('Query Not Matched');
    }
  } catch (e) {
    return next(e);
  }
};

export const newsDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user) {
      res.status(401).send({message: 'Authentication Failed'});
    }
    const news = await News.findById(req.params.id);
    if (!news) {
      throw createError(
        401,
        'Doesnot Exists',
        'News for given id donot exists'
      );
    }
    news.clicks += 1;
    await news.save();
    res.send(news);
  } catch (error) {
    return next(error);
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
    res.send(createResponse('News added Successfully', news));
  } catch (err) {
    next(err);
  }
};

export const deleteNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload.id);
    if (user === null || user.adminOf.length === 0) {
      throw createError(
        401,
        'Unauthorized',
        'Only admins are allowed to delete news'
      );
    }
    await News.findByIdAndDelete(req.params.id);
    res.send(createResponse('News deleted Successfully', {}));
  } catch (error) {
    next(error);
  }
};

export const updateNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // verify user
    const user = await User.findById(req.payload.id);
    if (user === null || user.adminOf.length === 0) {
      throw createError(
        401,
        'Unauthorized',
        'Only admins are allowed to update news'
      );
    }
    // verify allowed fields
    const allowedUpdates = [
      'sourceName',
      'sourceUrl',
      'title',
      'author',
      'description',
      'imgUrl',
      'content',
    ];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      res.send(
        createResponse(
          'Update fields donot match. Following can only be updated',
          allowedUpdates
        )
      );
    }
    // Finally updating
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body);
    res.send(createResponse('News Updated Succesfully', updatedNews));
  } catch (err) {
    next(err);
  }
};

// ?tested Ok
// report News
export const reportNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload.id);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Authorization Failed');
    }
    const report = {
      ...req.body,
      reporter: user._id,
    };
    const news = await News.findById(req.params.id);
    if (!news) {
      throw createError(401, 'News donot exists', 'News donot exists');
    }
    news.reports.push(report);

    // save the news object
    await news.save();

    res.send(createResponse('Report issued successfully', report));
  } catch (e) {
    next(e);
  }
};
