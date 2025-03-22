export const schemaGift = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    video: { type: 'string' },
    images: { type: 'array', items: { type: 'string', format: 'binary' } },
    base_price: { type: 'number' },
    discount_price: { type: 'number' },
    start_date: { type: 'string', format: 'date' },
    end_date: { type: 'string', format: 'date' },
    productDetailIds: {
      type: 'array',
      items: { type: 'number', format: 'int32' },
    },
  },
};
