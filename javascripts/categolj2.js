var categolj2 = {};

//categolj2.API_ROOT = 'https://s3-ap-northeast-1.amazonaws.com/dummyapi';
categolj2.API_ROOT = './dummyapi';
categolj2.SEPARATOR = '::';

// Models
categolj2.Entry = Backbone.Model.extend({
    url: function () {
        return categolj2.API_ROOT + '/entries/' + encodeURIComponent(this.id) + '.json';
    }
});
categolj2.RecentPost = Backbone.Model.extend({
});
categolj2.Category = Backbone.Model.extend({
});
categolj2.Link = Backbone.Model.extend({
});

// Collections
categolj2.Entries = Backbone.Collection.extend({
    url: categolj2.API_ROOT + '/entries.json',
    model: categolj2.Entry
});
categolj2.RecentPosts = Backbone.Collection.extend({
    url: categolj2.API_ROOT + '/recent_posts.json',
    model: categolj2.RecentPost
});
categolj2.Categories = Backbone.Collection.extend({
    url: categolj2.API_ROOT + '/categories.json',
    model: categolj2.Category
});
categolj2.Links = Backbone.Collection.extend({
    url: categolj2.API_ROOT + '/links.json',
    model: categolj2.Link
});

// Views

categolj2.MainView = Backbone.View.extend({
});

categolj2.EntriesView = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#entry-tmpl').html()),
    render: function () {
        var html = _.map(this.collection.models, _.bind(function (entry) {
            return this.template(entry.toJSON());
        }, this)).join('');
        this.$el.html(html);
        return this;
    }
});

categolj2.EntryView = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#entry-tmpl').html()),
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

categolj2.RecentPostsView = Backbone.View.extend({
    template: Handlebars.compile($('#recent-posts-tmpl').html()),
    render: function () {
        this.$el.html(this.template({
            recent_posts: this.collection.toJSON()
        }));
        return this;
    }
});

categolj2.CategoriesView = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#categories-tmpl').html()),
    render: function () {
        this.$el.html(this.template({
            categories: this.collection.toJSON()
        }));
        return this;
    }
});

categolj2.EntriesByCategoryView = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#category-tmpl').html()),
    render: function () {
        var category = this.options.category.split(categolj2.SEPARATOR);
        this.$el.append(this.template({
            category: category
        }));
        var entries = new categolj2.Entries();
        var entriesView = new categolj2.EntriesView({
            collection: entries
        });
        entries.fetch().success(_.bind(function () {
            this.$el.append(entriesView.render().el);
        }, this));
        return this;
    }
});

categolj2.EntriesByUserView = Backbone.View.extend({

});

categolj2.SearchFormView = Backbone.View.extend({
    template: Handlebars.compile($('#search-result-tmpl').html()),
    events: {
        'submit': 'search'
    },
    search: function (e) {
        e.preventDefault();
        var q = this.$('input[name=q]').val();
        var $div = $('<div>');
        $div.append(this.template({
            keyword: q
        }));
        var entries = new categolj2.Entries();
        var entriesView = new categolj2.EntriesView({
            collection: entries
        });
        entries.fetch().success(_.bind(function () {
            $div.append(entriesView.render().el);
        }, this));
        this.options.mainView.$el.html($div);
    }
});

categolj2.LinksView = Backbone.View.extend({
    template: Handlebars.compile($('#links-tmpl').html()),
    render: function () {
        this.$el.html(this.template({
            links: this.collection.toJSON()
        }));
        return this;
    }
});