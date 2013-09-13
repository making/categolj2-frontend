Handlebars.registerHelper('categoryLink', function (categories) {
    var ret = [], categoriesBuf = [], sep = '::';
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        categoriesBuf.push(_.escape(category.category_name));

        ret.push('<a href="categories/' + encodeURIComponent(categoriesBuf.join(sep)) + '/entries">'
            + _.escape(category.category_name)
            + '</a>');
    }
    return new Handlebars.SafeString(ret.join(sep));
});

var Router = Backbone.Router.extend({
    routes: {
        '': 'showEntries'
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
    },
    showEntries: function () {
        this.entries = new categolj2.Entries();
        this.entriesView = new categolj2.EntriesView({
            collection: this.entries
        });

        var that = this;
        this.entries.fetch().success(function () {
            that.entriesView.render();
        });
    }
});

var router = new Router();
$(function () {
    Backbone.history.start();
});