Handlebars.registerHelper('categoryLink', function (categories) {
    var ret = [], categoriesBuf = [], sep = '::';
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        categoriesBuf.push(_.escape(category.category_name));

        ret.push('<a href="#categories/' + encodeURIComponent(categoriesBuf.join(sep)) + '/entries">'
            + _.escape(category.category_name)
            + '</a>');
    }
    return new Handlebars.SafeString(ret.join(sep));
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
                url: categolj2.apiRoot + '/entries/' + id + '.json',
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
    showCategory: function(category) {
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