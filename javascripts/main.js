Handlebars.registerHelper('categoryLink', function (category) {
    var ret = [], categoriesBuf = [];
    for (var i = 0; i < category.length; i++) {
        var c = category[i];
        categoriesBuf.push(_.escape(c.category_name));

        ret.push('<a href="#/categories/' + encodeURIComponent(categoriesBuf.join(categolj2.SEPARATOR)) + '/entries">'
            + _.escape(c.category_name) + '</a>');
    }
    return new Handlebars.SafeString(ret.join(categolj2.SEPARATOR));
});
Handlebars.registerHelper('breadcrumb', function (category) {
    var ret = [], categoriesBuf = [];
    for (var i = 0; i < category.length; i++) {
        var c = category[i];
        categoriesBuf.push(_.escape(c));

        ret.push('<li><a href="#/categories/' + encodeURIComponent(categoriesBuf.join(categolj2.SEPARATOR)) + '/entries">'
            + _.escape(c) + '</a></li>');
    }
    return new Handlebars.SafeString(ret.join(''));
});
Handlebars.registerHelper('toString', function (obj) {
    return JSON.stringify(obj);
});
var Router = Backbone.Router.extend({
    routes: {
        '': 'showEntries',
        'entries/:id': 'showEntry',
        'categories': 'showCategories',
        'categories/:categories/entries': 'showCategory',
        'users/:id/entries': 'showEntries'
    },
    initialize: function () {
        this.recentPosts = new categolj2.RecentPosts();
        this.recentPostsView = new categolj2.RecentPostsView({
            collection: this.recentPosts
        });

        var that = this;
        this.recentPosts.fetch().success(function () {
            that.recentPostsView.render();
        });

        this.mainView = new categolj2.MainView();

        var links = new categolj2.Links();
        links.fetch().success(function () {
            var linksView = new categolj2.LinksView({
                collection: links
            });
            linksView.render();
        });
    },
    showEntries: function () {
        this.entries = new categolj2.Entries();
        var entriesView = new categolj2.EntriesView({
            collection: this.entries
        });

        var that = this;
        this.entries.fetch().success(function () {
            that.mainView.$el.html(entriesView.render().el);
        });
    },
    showEntry: function (id) {
        var entry;
        if (this.entries) {
            entry = this.entries.where({entry_id: Number(id)}, true);
        }

        if (!entry) {
            entry = new categolj2.Entry();
            entry.fetch({
                url: categolj2.API_ROOT + '/entries/' + encodeURIComponent(id) + '.json',
                async: false
            });
            if (this.entries) {
                this.entries.add(entry);
            }
        }
        var entryView = new categolj2.EntryView({
            model: entry
        });
        this.mainView.$el.html(entryView.render().el);
    },
    showCategories: function () {
        var categories = new categolj2.Categories();
        var categoriesView = new categolj2.CategoriesView({
            collection: categories
        });
        var that = this;
        categories.fetch().success(function () {
            that.mainView.$el.html(categoriesView.render().el);
        });
    },
    showCategory: function (category) {
        var categoryView = new categolj2.CategoryView({
            category: category
        });
        this.mainView.$el.html(categoryView.render().el);
    }
});

var router = new Router();
$(function () {
    Backbone.history.start();
});