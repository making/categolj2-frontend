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
        'categories': 'showCategories',
        'categories/:categories/entries': 'showEntriesByCategory',
        'users/:id/entries': 'showEntries'
    },
    initialize: function () {
        this.recentPosts = new categolj2.RecentPosts();
        this.recentPostsView = new categolj2.RecentPostsView({
            el: $('#recent-posts'),
            collection: this.recentPosts
        });

        this.recentPosts.fetch().success(_.bind(function () {
            this.recentPostsView.render();
        }, this));

        this.mainView = new categolj2.MainView({
            el: $('#main')
        });
        this.searchFormView = new categolj2.SearchFormView({
            el: $('#search-form')
        });

        var links = new categolj2.Links({
            el: $('#links')
        });
        links.fetch().success(function () {
            var linksView = new categolj2.LinksView({
                collection: links
            });
            linksView.render();
        });
    },
    showEntries: function (page, size) {
        page = Number(page) || 1;
        size = Number(size) || 10;
        this.entries = new categolj2.Entries();
        var entriesView = new categolj2.EntriesView({
            collection: this.entries
        });

        this.entries.fetch().success(_.bind(function () {
            this.mainView.$el.html(entriesView.render().el);
        }, this));
    },
    showEntry: function (id) {
        var entry;
        if (this.entries) {
            entry = this.entries.where({
                entry_id: Number(id)
            }, true);
        }

        if (!entry) {
            entry = new categolj2.Entry({
                id: id
            });
            entry.fetch({
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

        categories.fetch().success(_.bind(function () {
            this.mainView.$el.html(categoriesView.render().el);
        }, this));
    },
    showEntriesByCategory: function (category) {
        var categoryView = new categolj2.EntriesByCategoryView({
            category: category
        });
        this.mainView.$el.html(categoryView.render().el);
    }
});

var router = new Router();
$(function () {
    Backbone.history.start();
});