var categolj2 = {};

// Models
categolj2.Entry = Backbone.Model.extend({
});
categolj2.RecentPost = Backbone.Model.extend({
});

// Collections
categolj2.Entries = Backbone.Collection.extend({
    url: 'https://s3-ap-northeast-1.amazonaws.com/dummyapi/entries.json',
    model: categolj2.Entry
});
categolj2.RecentPosts = Backbone.Collection.extend({
    url: 'https://s3-ap-northeast-1.amazonaws.com/dummyapi/recent_posts.json',
    model: categolj2.RecentPost
});

// Views
categolj2.EntriesView = Backbone.View.extend({
    el: $('#main'),
    template: Handlebars.compile($('#entries-tmpl').html()),
    render: function () {
        this.$el.html(this.template({entries: this.collection.toJSON()}));
        return this;
    }
});

categolj2.EntryView = Backbone.View.extend({
    el: $('#main'),
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