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
      //res.status(401).send({message: 'Authentication Failed'});
      throw createError(401, 'Unauthorized', 'Invalid Credentials');
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

    // Update the newsTrend Rate ,every time it is fetched
    const timeElapsedInHours =
      (new Date().getTime() - news.createdAt.getTime()) / (1000 * 60 * 60);
    //console.log(timeElapsedInHours);
    news.trendRate = news.clicks / Math.ceil(timeElapsedInHours);
    //console.log(news.trendRate);
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
    if (user === null) {
      throw createError(401, 'Invalid', 'Invalid Login Credentials');
    }
    if (!user.isAdmin && !user.isSuperAdmin && !user.superSuperAdmin) {
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to add news'
      );
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
    if (user === null) {
      throw createError(401, 'Invalid', 'Invalid Login credentials');
    }
    if (!user.isAdmin && !user.isSuperAdmin && !user.superSuperAdmin) {
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to delete news'
      );
    }

    //If user is ONLY admin , he can delete only his news. SuperAdmins can delete all news
    const news = await News.findById(req.params.id);
    if (
      user.isSuperAdmin === false &&
      user.superSuperAdmin === false &&
      user.isAdmin === true &&
      news !== null
    ) {
      if (!news.createdBy.equals(user._id)) {
        throw createError(
          401,
          'Unauthorized',
          'Admins can delete only their own news'
        );
      }
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
    if (user === null) {
      throw createError(401, 'Invalid', 'Invalid Login credentials');
    }
    if (!user.isAdmin && !user.isSuperAdmin && !user.superSuperAdmin) {
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to update news'
      );
    }

    //Admins can update ONLY their own news
    const news = await News.findById(req.params.id);
    if (
      user.isSuperAdmin === false &&
      user.superSuperAdmin === false &&
      user.isAdmin === true &&
      news !== null
    ) {
      if (!news.createdBy.equals(user._id)) {
        throw createError(
          401,
          'Unauthorized',
          'Admins can update only their own news'
        );
      }
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
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid Login credentials');
    }
    if (!user.isAdmin && !user.isSuperAdmin && !user.superSuperAdmin) {
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to toggleOffVisibility of news'
      );
    }
    //Admins can toggle OFF ONLY their own news
    const news = await News.findById(req.params.id);
    if (!news) {
      throw createError(400, 'field doesnt exist', 'News donot exists');
    }
    if (
      user.isSuperAdmin === false &&
      user.superSuperAdmin === false &&
      user.isAdmin === true &&
      news !== null
    ) {
      if (!news.createdBy.equals(user._id)) {
        throw createError(
          401,
          'Unauthorized',
          'Admins can toggleOffVisibility only their own news'
        );
      }
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
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Invalid Login credentials');
    }
    if (!user.isAdmin && !user.isSuperAdmin && !user.superSuperAdmin) {
      throw createError(
        401,
        'Unauthorized',
        'You are not authorized to getReportedNews news'
      );
    }
    // fetch only  news reported more than and equal to 1
    const count = req.params.count !== undefined ? req.params.count : 5;
    const news = await News.find({reports: {$size: {$gt: count}}});
    res.send(createResponse('Reported News', news));
  } catch (error) {
    next(error);
  }
};
export const getTrendNews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.payload);
    if (user === null) {
      throw createError(401, 'Unauthorized', 'Authorization Failed');
    }
    const news = await News.find(
      {visible: true},
      {},
      {
        limit: parseInt(req.query.limit),
        sort: {trendRate: -1},
      }
    );

    res.send(news);
  } catch (e) {
    next(e);
  }
};
