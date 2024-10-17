export enum Route {
  HealthCheck = '/health-check',

  User = '/user',

  AuthLogin = '/auth/login',
  AuthLogout = '/auth/logout',

  Product = '/product',
  ProductListing = '/product/listing',
  ProductListingId = '/product/listing/:id',
  ProductOrder = '/product/order',
  ProductOrderId = '/product/order/:id',
}
