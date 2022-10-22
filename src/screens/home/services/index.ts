import configServices from '@src/utils/configServices';
import {SearchModel} from './search.model';

export const fetchListOrder = async (tang: string) => {
  try {
    const result = await configServices.getService('SO1/List', null, null, {
      tang
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchListOrderSearch = async (searchModel: SearchModel) => {
  try {
    let phKey = '';
    if (searchModel.ngay_ct !== '' && searchModel.so_ct !== '') {
      phKey = `ngay_ct='${searchModel.ngay_ct}' and so_ct='${searchModel.so_ct}'`;
    } else if (searchModel.ngay_ct !== '' && searchModel.so_ct === '') {
      phKey = `ngay_ct='${searchModel.ngay_ct}'`;
    } else if (searchModel.ngay_ct === '' && searchModel.so_ct !== '') {
      phKey = `so_ct='${searchModel.so_ct}'`;
    }
    const result = await configServices.getService('SO1/Find', null, null, {phKey, tang: searchModel.tang});
    return result;
  } catch (error) {
    throw error;
  }
};
