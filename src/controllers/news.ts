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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // interface LooseObject {
    //   [key: string]: number;
    // }
    const sort: {[k: string]: number} = {};
    // const sort: LooseObject = {};
    if (req.query.sortBy !== undefined) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    console.log(sort);
    const news = await News.find(
      {visible: true},
      {
        author: 1,
        description: 1,
        imgUrl: 1,
        clicks: 1,
        title: 1,
        sourceName: 1,
        createdAt: 1,
      },
      {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      }
    );
    res.send(news);
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
    const user = await User.findById(req.payload);
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
    const user = await User.findById(req.payload);
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
    const user = await User.findById(req.payload);
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
    const user = await User.findById(req.payload);
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
      'visible',
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
    const user = await User.findById(req.payload);
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

export const toggleVisibilityOfNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null || user.adminOf.length === 0) {
      throw createError(401, 'Unauthorized', 'Authorization Failed');
    }
    const news = await News.findById(req.params.id);
    if (!news) {
      throw createError(400, 'field doesnt exist', 'News donot exists');
    }
    news.visible = !news.visible;
    await news.save();
    res.send(createResponse('succefull', {visibleStatus: news.visible}));
  } catch (error) {
    next(error);
  }
};

export const getReportedNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null || user.adminOf.length === 0) {
      throw createError(401, 'Unauthorized', 'Authorization Failed');
    }
    // fetch only  news reported more than and equal to 1
    const news = await News.find({$where: 'this.reports.length>0'});
    res.send(createResponse('Reported News', news));
  } catch (error) {
    next(error);
  }
};
