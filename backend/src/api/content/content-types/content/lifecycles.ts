/**
 * Content lifecycle hooks (T082)
 * コンテンツあたりの画像数制限（10枚）
 */

import { errors } from '@strapi/utils';

const MAX_IMAGES = 10;

export default {
  async beforeCreate(event: { params: { data: { images?: any[] } } }) {
    validateImageCount(event.params.data);
  },

  async beforeUpdate(event: { params: { data: { images?: any[] } } }) {
    if (event.params.data.images) {
      validateImageCount(event.params.data);
    }
  },
};

function validateImageCount(data: { images?: any[] }) {
  if (data.images && data.images.length > MAX_IMAGES) {
    throw new errors.ApplicationError(
      `1コンテンツあたり画像は${MAX_IMAGES}枚までです。現在${data.images.length}枚が指定されています。`
    );
  }
}
