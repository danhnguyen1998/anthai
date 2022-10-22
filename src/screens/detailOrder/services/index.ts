import configServices from '@src/utils/configServices';
import {DetailOrderSearchModel, DetailOrderUpdateLevelStatusModel} from './detailOrder.model';

export const fetchDetailOrder = async (detailOrderSearch: DetailOrderSearchModel) => {
  try {
    const result = await configServices.getService('SO1/Detail', null, null, detailOrderSearch);
    return result;
  } catch (error) {}
};

export const fetchUpdateDetailOrder = async (detailOrderUpdate: any[]) => {
  try {
    const result = await configServices.postService('SO1/Update', detailOrderUpdate, null);
    return result;
  } catch (error) {}
};

export const fetchUpdateLevelStatusOrder = async (
  detailOrderUpdateLevelStatusModel: DetailOrderUpdateLevelStatusModel,
) => {
  try {
    const result = await configServices.postService('SO1/UpdateLevelStatus', {}, detailOrderUpdateLevelStatusModel);
    return result;
  } catch (error) {}
};
