import News from '../models/news';

export const trendUpdate = async () => {
  try {
    console.log('News TrendUpdate:Start', Date.now());
    const news = await News.find({visible: true});
    news.forEach(async thisDoc => {
      const timeElapsedInHours =
        (new Date().getTime() - thisDoc.createdAt.getTime()) / (1000 * 60 * 60);
      const trendRate = thisDoc.clicks / timeElapsedInHours;
      thisDoc.trendRate = trendRate;

      await News.updateOne({_id: thisDoc._id}, {$set: {trendRate: trendRate}});
    });
    console.log('News TrendUpdate:Stop', Date.now());
  } catch (err) {
    console.log(err);
  }
};
