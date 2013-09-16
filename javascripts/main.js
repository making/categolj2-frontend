Handlebars.registerHelper('categoryLink', function (category) {
    var ret = [], categoriesBuf = [];
    _.each(category, function (c) {
        categoriesBuf.push(_.escape(c.category_name));
        ret.push('<a href="#/categories/' + encodeURIComponent(categoriesBuf.join(categolj2.SEPARATOR)) + '/entries">'
            + _.escape(c.category_name) + '</a>');
    });
    return new Handlebars.SafeString(ret.join(categolj2.SEPARATOR));
});
Handlebars.registerHelper('breadcrumb', function (category) {
    var ret = [], categoriesBuf = [];
    _.each(category, function (c) {
        categoriesBuf.push(_.escape(c));
        ret.push('<li><a href="#/categories/' + encodeURIComponent(categoriesBuf.join(categolj2.SEPARATOR)) + '/entries">'
            + _.escape(c) + '</a></li>');
    });
    return new Handlebars.SafeString(ret.join(''));
});
Handlebars.registerHelper('toString', function (obj) {
    return JSON.stringify(obj);
});
var Router = Backbone.Router.extend({
    routes: {
        '': 'showEntries',
        'entries?page.page=:page&page.size=:size': 'showEntries',
        'entries/:id': 'showEntry',
        'entries?q=:keyword': 'showSearchResult',
        'categories': 'showCategories',
        'categories/:categories/entries': 'showEntriesByCategory',
        'users/:id/entries': 'showEntries'
    },
    initialize: function () {
        this.appView = new categolj2.AppView({
            el: $('#main')
        });
    },
    showEntries: function (page, size) {
        this.appView.showEntries(page, size);
    },
    showEntry: function (id) {
        this.appView.showEntry(id);
    },
    showSearchResult: function (keyword) {
        this.appView.showSearchResult(keyword);
    },
    showCategories: function () {
        this.appView.showCategories();
    },
    showEntriesByCategory: function (category) {
        this.appView.showEntriesByCategory(category);
    }
});

var router = new Router();
$(function () {
    Backbone.history.start();
});