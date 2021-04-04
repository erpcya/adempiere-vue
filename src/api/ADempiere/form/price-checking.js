// Get Instance for connectionimport {
import { request } from '@/utils/ADempiere/request'

// List Point of sales
export function requestGetProductPrice({
  searchValue,
  upc,
  value,
  name,
  priceListUuid,
  businessPartnerUuid,
  warehouseUuid,
  validFrom
}) {
  return request({
    url: '/pos/get-product-price',
    method: 'post',
    data: {
      search_value: searchValue,
      upc,
      value,
      name,
      price_list_uuid: priceListUuid,
      business_partner_uuid: businessPartnerUuid,
      warehouse_uuid: warehouseUuid,
      valid_from: validFrom
    }
  })
    .then(productPriceResponse => {
      const { convertProductPrice } = require('@/utils/ADempiere/apiConverts/core.js')

      return convertProductPrice(productPriceResponse)
    })
}
