import configServices from '@src/utils/configServices';

export const fetchUpdateDetailOrder = async (detailOrderUpdate: any[]) => {
  try {
    const result = await configServices.postService('SO1/Update', detailOrderUpdate, null);
    return result;
  } catch (error) {}
};

export const fetchGetTon = async (ma_vt: string) => {
  try {
    const result = await configServices.postService(
      'SO1/GetTon',
      {
        ma_vt,
      },
      null,
    );
    console.log(result, 'result  l');
    return result;
  } catch (error) {}
};

export const fetchGetViTri = async (ma_vitri: string) => {
  try {
    const result = await configServices.postService(
      'SO1/GetViTri',
      {
        ma_vitri,
      },
      null,
    );
    return result;
  } catch (error) {
    throw error;
  }
};
