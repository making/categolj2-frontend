$(function () {
    Handlebars.registerHelper('categoryLink', function (categories) {
        var ret = [], categoriesBuf = [], sep = '::';
        for (var i = 0; i < categories.length; i++) {
            var category = categories[i];
            categoriesBuf.push(Handlebars.Utils.escapeExpression(category.category_name));

            ret.push('<a href="categories/' + encodeURIComponent(categoriesBuf.join(sep)) + '/entries">'
                + Handlebars.Utils.escapeExpression(category.category_name)
                + '</a>');
        }
        return new Handlebars.SafeString(ret.join(sep));
    });

    $.getJSON('https://s3-ap-northeast-1.amazonaws.com/dummyapi/entries.json').success(function (data) {
        var recentPosts = new categolj2.RecentPosts(_.map(data.recent_post, function (e) {
            return new categolj2.RecentPost(e);
        }));
        var recentPostsView = new categolj2.RecentPostsView({
            collection: recentPosts
        });
        recentPostsView.render();

        var entries = new categolj2.Entries(_.map(data.entries, function (e) {
            return new categolj2.Entry(e);
        }));
        var entriesView = new categolj2.EntriesView({
            collection: entries
        });
        entriesView.render();
    });
});