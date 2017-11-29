function query_params() {
    var query = location.search;
    query = query.substr(1, query.length - 1);
    var fields = new Array();
    fields = query.split("&");
    var params = new Array();
    for (var f = 0; f < fields.length; f++) {
        var eq_i = fields[f].indexOf("=");
        params[unescape(fields[f].substring(0, eq_i))] = unescape(fields[f].substring(eq_i + 1, fields[f].length));
    }
    return params;
}