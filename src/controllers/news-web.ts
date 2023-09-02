import News from '../models/news';
import {Request, Response, NextFunction} from 'express';
import {createError} from '../utils/helpers';

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
      const parts = req.query.sortBy.toString().split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    // console.log(sort);
    const limit =
      req.query.limit !== undefined ? parseInt(req.query.limit.toString()) : 20;

    const skip =
      req.query.skip !== undefined ? parseInt(req.query.skip.toString()) : 0;

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
        trendRate: 1,
      },
      {
        limit: limit,
        skip: skip,
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
    const news = await News.findById(req.params.id);
    if (!news || news.visible === false) {
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
    news.trendRate = news.clicks / timeElapsedInHours;
    //console.log(news.trendRate);
    await news.save();
    res.send(news);
  } catch (error) {
    return next(error);
  }
};
