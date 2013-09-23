Handlebars.registerHelper('categoryLink', function (category) {
    var ret = [], categoriesBuf = [];
    _.each(category, function (c) {
        categoriesBuf.push(_.escape(c));
        ret.push('<a href="#/categories/' + categoriesBuf.join(categolj2.SEPARATOR) + '/entries">'
            + _.escape(c) + '</a>');
    });
    return new Handlebars.SafeString(ret.join(categolj2.SEPARATOR));
});
Handlebars.registerHelper('breadcrumb', function (category) {
    var ret = [], categoriesBuf = [];
    _.each(category, function (c) {
        categoriesBuf.push(_.escape(c));
        ret.push('<li><a href="#/categories/' + categoriesBuf.join(categolj2.SEPARATOR) + '/entries">'
            + _.escape(c) + '</a></li>');
    });
    return new Handlebars.SafeString(ret.join(''));
});
Handlebars.registerHelper('unescape', function (string) {
    return new Handlebars.SafeString(string);
});
Handlebars.registerHelper('toString', function (obj) {
    return JSON.stringify(obj);
});
var Router = Backbone.Router.extend({
    routes: {
        '': 'showEntries',
        '?page=:page&size=:pageSize': 'showEntries',
        'entries': 'showEntries',
        'entries?page=:page&size=:pageSize': 'showEntries',
        'entries/:id': 'showEntry',
        'entries?q=:keyword&page=:page&size=:pageSize': 'showSearchResult',
        'entries?q=:keyword': 'showSearchResult',
        'categories': 'showCategories',
        'categories/:categories/entries?page=:page&size=:pageSize': 'showEntriesByCategory',
        'categories/:categories/entries': 'showEntriesByCategory',
        'users/:id/entries?page=:page&size=:pageSize': 'showEntriesByUser',
        'users/:id/entries': 'showEntriesByUser'
    },
    initialize: function () {
        new categolj2.LoadingView();
        this.appView = new categolj2.AppView({
            el: $('#main')
        });
    },
    // delegate to appView
    showEntries: function (page, pageSize) {
        this.appView.showEntries(page, pageSize);
    },
    showEntry: function (id) {
        this.appView.showEntry(id);
    },
    showSearchResult: function (keyword, page, pageSize) {
        this.appView.showSearchResult(keyword, page, pageSize);
    },
    showCategories: function () {
        this.appView.showCategories();
    },
    showEntriesByCategory: function (category, page, pageSize) {
        this.appView.showEntriesByCategory(category, page, pageSize);
    },
    showEntriesByUser: function (userId, page, pageSize) {
        this.appView.showEntriesByUser(userId, page, pageSize);
    }
});

var router = new Router();
$(function () {
    Backbone.history.start();
});