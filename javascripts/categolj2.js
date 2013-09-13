var categolj2 = {};

// Models
categolj2.Entry = Backbone.Model.extend({
});
categolj2.RecentPost = Backbone.Model.extend({
});

// Collections
categolj2.Entries = Backbone.Collection.extend({
    model: categolj2.Entry
});
categolj2.RecentPosts = Backbone.Collection.extend({
    model: categolj2.RecentPost
});

// Views
categolj2.EntriesView = Backbone.View.extend({
    el: $('#entries'),
    template: Handlebars.compile($('#entries-tmpl').html()),
    render: function () {
        this.$el.html(this.template({entries: this.collection.toJSON()}));
        return this;
    }
});

categolj2.RecentPostsView = Backbone.View.extend({
    el: $('#recent-posts'),
    template: Handlebars.compile($('#recent-posts-tmpl').html()),
    render: function () {
        this.$el.html(this.template({recent_post: this.collection.toJSON()}));
        return this;
    }
});