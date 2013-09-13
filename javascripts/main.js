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

var Router = Backbone.Router.extend({
    routes: {
        '': 'showEntries',
        'entries/:id': 'showEntry',
        'categories': 'showEntries',
        'categories/:categories/entries': 'showEntries',
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
    },
    showEntries: function () {
        this.entries = new categolj2.Entries();
        var entriesView = new categolj2.EntriesView({
            collection: this.entries
        });

        this.entries.fetch().success(function () {
            entriesView.render();
        });
    },
    showEntry: function (id) {
        var entry;
        if (this.entries) {
            var tmp = this.entries.where({entry_id: Number(id)});
            if (tmp.length == 1) {
                entry = tmp[0]
            }
        }

        if (!entry) {
            entry = new categolj2.Entry();
            entry.fetch({
                url: 'https://s3-ap-northeast-1.amazonaws.com/dummyapi/entries/' + id + '.json',
                async: false
            });
            if (this.entries) {
                this.entries.add(entry);
            }
        }
        console.log(entry);
        var entryView = new categolj2.EntryView({
            model: entry
        });
        entryView.render();
    }
});

var router = new Router();
$(function () {
    Backbone.history.start();
});