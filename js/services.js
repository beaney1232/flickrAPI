var purchases = angular.module('purchases', ['ngResource']);

app.factory('Purchase', ['$resource',
  function ($resource) {
    return $resource('http://infinity.pagesuite.com//api/subscriptions/purchased.aspx?uuid=82B78DCC-CD3A-4B34-A0A5-5A7FB18AF18C&appid=2657&platformid=1&credential1=&credential2=&credential3=&width=768&height=1024', {}, {
      query: { method: 'GET', params: { phoneId: '' }, isArray: true }
    });
  }]);