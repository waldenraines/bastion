describe('Directive: bstBookmark', function() {
    var scope,
        compile,
        element,
        elementScope,
        $modal;

    beforeEach(module(function($provide) {
        $modal = {
            $get: function() {
                return this;
            },
            open: function() {
                var deferred = $q.defer();
                deferred.resolve({});

                return {
                    result: deferred.promise
                }
            }
        };
            $provide.provider('$modal', $modal);
    }));

    beforeEach(module('Bastion', 'Bastion.components', 'components/views/bst-bookmark.html'));

    beforeEach(inject(function(_$compile_, _$rootScope_, $injector) {
        compile = _$compile_;
        scope = _$rootScope_;
        $httpBackend = $injector.get('$httpBackend');
        BstBookmark = $injector.get('BstBookmark');
    }));

    beforeEach(function() {
        testItem = [
            {name:"name",
             controller:"controller",
             query:"query",
             public:null}
        ];
        scope.item = testItem;

        element = angular.element('<ul bst-bookmark controllerName="controllerName"></ul>');
        compile(element)(scope);
        scope.$digest();
    });

    it("should display a <li>", function() {
        $httpBackend.expectGET('/api/v2/bookmarks').respond(testItem[0]);
        expect(element.find('li').length).toBe(4);
    });

    // it("should open a modal upon triggering", function() {
    //     spyOn(openModal());

    // });
});
