var categolj2 = {};

//categolj2.API_ROOT = 'https://s3-ap-northeast-1.amazonaws.com/dummyapi';
//categolj2.API_ROOT = './dummyapi';
//categolj2.API_ROOT = 'http://localhost:8080/categolj/api';
categolj2.API_ROOT = 'http://blog.ik.am/api';
categolj2.SEPARATOR = '::';

// Models
categolj2.Entry = Backbone.Model.extend({
    idAttribute: 'entryId',
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
    defaults: {
        pageAttributes: {

        }
    },
    url: categolj2.API_ROOT + '/entries.json',
    model: categolj2.Entry,
    parse: function (response) {
        this.pageAttibutes = _.omit(response, 'content');
        //console.log(this.pageAttibutes);
        return response.content;
    }
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

function scroll() {
    $('body').animate({scrollTop: 0}, 'fast');
}

// Views

categolj2.AppView = Backbone.View.extend({
    initialize: function () {
        this.recentPosts = new categolj2.RecentPosts();
        this.recentPostsView = new categolj2.RecentPostsView({
            el: $('#recent-posts'),
            collection: this.recentPosts
        });

        this.recentPosts.fetch().success(_.bind(function () {
            this.recentPostsView.render();
        }, this));

        this.searchFormView = new categolj2.SearchFormView({
            el: $('#search-form')
        });

        var links = new categolj2.Links({
        });
        var linksView = new categolj2.LinksView({
            el: $('#links'),
            collection: links
        });
        links.fetch().success(_.bind(function () {
            linksView.render();
        }, this));
    },
    showEntries: function (page, size) {
        page = Number(page) || 1;
        size = Number(size) || 10;
        this.entries = new categolj2.Entries();
        var entriesView = new categolj2.EntriesView({
            collection: this.entries
        });

        this.entries.fetch().success(_.bind(function () {
            this.$el.html(entriesView.render().el);
        }, this));
        scroll();
    },
    showEntry: function (id) {
        var entry;
        if (this.entries) {
            entry = this.entries.get(Number(id));
        }

        if (!entry) {
            entry = new categolj2.Entry({
                entryId: id
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
        this.$el.html(entryView.render().el);
        scroll();
    },
    showSearchResult: function (keyword) {
        var searchResultView = new categolj2.SearchResultView({
            keyword: keyword
        });
        this.$el.html(searchResultView.render().el);
        scroll();
    },
    showCategories: function () {
        var categories = new categolj2.Categories();
        var categoriesView = new categolj2.CategoriesView({
            collection: categories
        });

        categories.fetch().success(_.bind(function () {
            this.$el.html(categoriesView.render().el);
        }, this));
        scroll();
    },
    showEntriesByCategory: function (category) {
        var entriesView = new categolj2.EntriesByCategoryView({
            category: category
        });
        this.$el.html(entriesView.render().el);
        scroll();
    },
    showEntriesByUser: function (userId) {
        var entriesView = new categolj2.EntriesByUserView({
            userId: userId
        });
        this.$el.html(entriesView.render().el);
        scroll();
    }
});

categolj2.EntriesView = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#entry-tmpl').html()),
    events: {
        'click button': 'renderContents'
    },
    render: function () {
        var html;
        if (this.collection.size() == 1) {
            // if there is only one model in collection, render it soon.
            var entry = this.collection.at(0);
            // set 'render' true to show contents
            html = this.template(_.extend({render: true}, entry.toJSON()));
        } else {
            // if there are some models in collection, render later and show button to render.
            html = _.map(this.collection.models, _.bind(function (entry) {
                // set 'button' true to show 'Read' button.
                var attributes = _.extend({button: true}, entry.toJSON());
                return this.template(attributes);
            }, this)).join('');
        }
        this.$el.html(html);
        return this;
    },
    renderContents: function (e) {
        var $button = $(e.target),
            id = $button.data('id'),
            entry = this.collection.get(Number(id));
        $button.parent().html(entry.get('contents'));
    }
});

categolj2.EntryView = Backbone.View.extend({
    tagName: 'div',
    template: Handlebars.compile($('#entry-tmpl').html()),
    render: function () {
        // set 'render' true to show contents
        var attributes = _.extend({render: true}, this.model.toJSON());
        this.$el.html(this.template(attributes));
        return this;
    }
});

categolj2.RecentPostsView = Backbone.View.extend({
    template: Handlebars.compile($('#recent-posts-tmpl').html()),
    render: function () {
        this.$el.html(this.template({
            recentPosts: this.collection.toJSON()
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
        entries.url = categolj2.API_ROOT + '/categories/' + this.options.category + '/entries.json';

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
    tagName: 'div',
    template: Handlebars.compile($('#entries-by-user-tmpl').html()),
    render: function () {
        this.$el.append(this.template({
            username: 'User(' + this.options.userId + ')'
        }));
        var entries = new categolj2.Entries();
        entries.url = categolj2.API_ROOT + '/users/' + this.options.userId + '/entries.json';
        var entriesView = new categolj2.EntriesView({
            collection: entries
        });
        entries.fetch().success(_.bind(function () {
            this.$el.append(entriesView.render().el);
        }, this));
        return this;
    }
});

categolj2.SearchFormView = Backbone.View.extend({
    template: Handlebars.compile($('#search-result-tmpl').html()),
    events: {
        'submit': 'search'
    },
    search: function (e) {
        e.preventDefault();
        var q = this.$('input[name=q]').val();
        Backbone.history.navigate('entries?q=' + q, {trigger: true});
    }
});

categolj2.SearchResultView = Backbone.View.extend({
    template: Handlebars.compile($('#search-result-tmpl').html()),
    tagName: 'div',
    render: function () {
        this.$el.append(this.template({
            keyword: this.options.keyword
        }));
        var entries = new categolj2.Entries();
        entries.url = categolj2.API_ROOT + '/entries.json?q=' + encodeURIComponent(this.options.keyword);
        var entriesView = new categolj2.EntriesView({
            collection: entries
        });
        entries.fetch().success(_.bind(function () {
            this.$el.focus();
            this.$el.append(entriesView.render().el);
        }, this));
        return this;
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

categolj2.LoadingView = Backbone.View.extend({
    el: '#loading',
    initialize: function () {
        this.spinner = new Spinner();
        $(document).ajaxStart(_.bind(this.spin, this));
        $(document).ajaxComplete(_.bind(this.stop, this));
    },
    spin: function () {
        this.spinner.spin(this.el);
    },
    stop: function () {
        this.spinner.stop();
    }
})