$(function () {
    var entriesTmpl = $('#entries-tmpl').html(),
        entriesCompiled = Handlebars.compile(entriesTmpl),
        $entries = $('#entries'),
        recentlyPostsTmpl = $('#recently-posts-tmpl').html(),
        recentlyPostsCompiled = Handlebars.compile(recentlyPostsTmpl),
        $recentlyPosts = $('#recently-posts');


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
        $entries.html(entriesCompiled(data));
        $recentlyPosts.html(recentlyPostsCompiled(data));
    });
});