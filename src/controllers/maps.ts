import {Request, Response} from 'express';
import {data} from '../utils/mapData';
export const allMapData = async (req: Request, res: Response) => {
  res.send(data);
};
