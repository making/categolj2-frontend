var categolj2 = {};

//categolj2.apiRoot = 'https://s3-ap-northeast-1.amazonaws.com/dummyapi';
categolj2.apiRoot = './dummyapi';

// Models
categolj2.Entry = Backbone.Model.extend({
});
categolj2.RecentPost = Backbone.Model.extend({
});
categolj2.Category = Backbone.Model.extend({
})

// Collections
categolj2.Entries = Backbone.Collection.extend({
    url: categolj2.apiRoot + '/entries.json',
    model: categolj2.Entry
});
categolj2.RecentPosts = Backbone.Collection.extend({
    url: categolj2.apiRoot + '/recent_posts.json',
    model: categolj2.RecentPost
});
categolj2.Categories = Backbone.Collection.extend({
    url: categolj2.apiRoot + '/categories.json',
    model: categolj2.Category
})

// Views

categolj2.MainView = Backbone.View.extend({
    el: $('#main')
})

categolj2.EntriesView = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#entries-tmpl').html()),
    render: function () {
        this.$el.html(this.template({entries: this.collection.toJSON()}));
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
    el: $('#recent-posts'),
    template: Handlebars.compile($('#recent-posts-tmpl').html()),
    render: function () {
        this.$el.html(this.template({recent_posts: this.collection.toJSON()}));
        return this;
    }
});

categolj2.CategoriesView = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#categories-tmpl').html()),
    render: function () {
        this.$el.html(this.template({categories: this.collection.toJSON()}));
        return this;
    }
})