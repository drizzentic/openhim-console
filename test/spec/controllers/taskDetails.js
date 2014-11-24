'use strict';
/* jshint expr: true */

describe('Controller: TaskDetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('openhimWebui2App'));

  var scope, createController, httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {

    httpBackend = $httpBackend;

    $httpBackend.when('GET', new RegExp('config/default.json')).respond({ 'protocol': 'https', 'host': 'localhost', 'port': 8080, 'title': 'Title', 'footerTitle': 'FooterTitle', 'footerPoweredBy': 'FooterPoweredBy' });

    $httpBackend.when('GET', new RegExp('.*/tasks/53e1eac5e907b57711509853')).respond({ '_id': '53e1eac5e907b57711509853', 'completedDate': '2014-08-11T11:57:15.145Z', 'remainingTransactions': 0, 'user': 'testuser', 'created': '2014-08-11T11:57:10.253Z', 'transactions': [{ 'tid': '53e072e1ccbb302937ffb773', 'tstatus': 'Completed' }, { 'tid': '53e064d1ccbb302937ffb772', 'tstatus': 'Completed' }], 'status': 'Completed' });

    createController = function() {
      scope = $rootScope.$new();
      return $controller('TaskDetailsCtrl', { $scope: scope, $routeParams: { taskId: '53e1eac5e907b57711509853' } });
    };

  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should attach a single task to the scope', function () {
    httpBackend.expectGET(new RegExp('.*/tasks/53e1eac5e907b57711509853'));
    createController();
    httpBackend.flush();
    scope.task.user.should.equal('testuser');
    scope.task.transactions.length.should.equal(2);
  });

  it('should get the execution time', function () {
    createController();
    httpBackend.flush();

    var executionTime = scope.getExecutionTime(scope.task);
    executionTime.should.equal('4.89');
  });

  it('should get the amount of rerun transactions that has been processed', function () {
    createController();
    httpBackend.flush();

    var processedTotal = scope.getProcessedTotal(scope.task);
    processedTotal.should.equal(2);
  });

});