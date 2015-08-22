describe('Ionic Content Banner Service', function() {

  beforeEach(module('ionic', 'jett.ionic.content.banner', function($provide) {
    ionic.requestAnimationFrame = function(cb) { cb(); };

    // For the sake of this test, we don't want ionContentBanner to
    // actually compile as a directive.
    // We are only testing the service.
    $provide.value('ionContentBannerDirective', []);
  }));

  function setUpDOM ($document) {
    var view = document.createElement('ion-view');
    view.setAttribute('nav-view', 'active');

    var content = document.createElement('ion-content');
    content.classList.add('scroll-content');

    view.appendChild(content);
    $document[0].body.appendChild(view);
  }

  function setup(options) {
    var scope;

    inject(function($ionicContentBanner, $timeout, $document) {
      setUpDOM($document);

      var close = $ionicContentBanner.show(options || {});
      $timeout.flush();
      $timeout.flush();
      scope = close.$scope;
    });
    return scope;
  }

  it('should set default options on scope', inject(function() {
    var scope = setup();

    expect(scope.icon).toEqual('ion-ios-close-empty');
    expect(scope.transition).toEqual('vertical');
    expect(scope.type).toEqual('info');
    expect(scope.text).toBeUndefined();
    expect(scope.interval).toBe(7000);
    expect(scope.closeOnStateChange).toBe(true);
    expect(scope.autoClose).toBe(null);
  }));

  it('should set custom options on scope', inject(function() {
    var backButton = function () {};
    var text = ['firstMessage', 'secondMessage'];

    var scope = setup({
      icon: 'ion-android-close-empty',
      transition: 'fade',
      type: 'error',
      $deregisterBackButton: backButton,
      text: ['firstMessage', 'secondMessage'],
      interval: 10000,
      autoClose: 7000,
      closeOnStateChange: false
    });

    expect(scope.icon).toEqual('ion-android-close-empty');
    expect(scope.transition).toEqual('fade');
    expect(scope.type).toEqual('error');
    expect(scope.text).toEqual(text);
    expect(scope.interval).toBe(10000);
    expect(scope.closeOnStateChange).toBe(false);
    expect(scope.autoClose).toBe(7000);
  }));

  it('show should add class on show', inject(function() {
    var scope = setup();
    expect(scope.element[0].classList.contains('content-banner-in')).toBe(true);
  }));

  it('close should remove classes, remove element and destroy scope', inject(function($document, $timeout) {
    var scope = setup();
    spyOn(scope, '$destroy');
    spyOn(scope.element, 'remove');
    scope.close();
    $timeout.flush();
    expect(scope.element[0].classList.contains('content-banner-in')).toBe(false);
    expect(scope.$destroy).toHaveBeenCalled();
    expect(scope.element.remove).toHaveBeenCalled();
  }));

  it('should closeOnStateChange by default', inject(function($rootScope) {
    var scope = setup();
    spyOn(scope, 'close');
    $rootScope.$broadcast('$stateChangeSuccess');
    expect(scope.close).toHaveBeenCalled();
  }));

  it('should not closeOnStateChange with option as false', inject(function($rootScope) {
    var scope = setup({
      closeOnStateChange: false
    });
    spyOn(scope, 'close');
    $rootScope.$broadcast('$stateChangeSuccess');
    expect(scope.close).not.toHaveBeenCalled();
  }));

});
