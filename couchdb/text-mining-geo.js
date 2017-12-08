{
    "_id": "_design/text-mining-geo",
    "views": {
        "geojson": {
            "map": "\n// javascript\nvar WHITESPACE_CHARS = ' \\f\\n\\r\\t\\u00a0\\u0020\\u1680\\u180e\\u2028\\u2029\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000';\n\nfunction normalizeWhitespace(text) {\n  var reWhitespace = new RegExp('[' + WHITESPACE_CHARS + ']+', 'g');\n  return text.replace(reWhitespace, ' ');\n}\n\nfunction degrees_to_decimal(data) {\n  result = data.degrees;\n  if (data.minutes) {\n    result += data.minutes / 60.0;\n  }\n  if (data.seconds) {\n    result += data.seconds / 3600.0;\n  }\n\n  if (data.hemisphere == 'S') {\n    result *= -1.0;\n  }\n  if (data.hemisphere == 'W') {\n    result *= -1.0;\n  }\n  return result;\n}\n\n// OCR pages\nfunction(doc) {\n  var csl = doc.message;\n  if (csl['page-text']) {\n\n    for (var i in csl['page-text']) {\n      var text = csl['page-text'][i];\n      text = normalizeWhitespace(text);\n      \n      //emit(doc._id, text);\n\n      // 26o45´53´´S 55o50´37´´W\n      var pattern = /(.{0,64})\\b((\\d+)[°|º|o]\\s*(\\d+)['|’|′|´]\\s*((\\d+(\\.\\d+)?)[\"|''|’’|”|″|´´])?\\s*([S|N])[,|-]?\\s*(\\d+)[°|º|o]\\s*(\\d+)['|’|′|´]\\s*((\\d+(\\.\\d+)?)[\"|''|’’|”|″|´´])?\\s*([W|E]))(.{0,64})/igm;\n\n      while (match = pattern.exec(text)) {\n\n        var highlight = {};\n        var n = match.length;\n\n        highlight.pre = match[1];\n        highlight.mid = match[2];\n        highlight.post = match[n - 1];\n\n        highlight.start = match.index + highlight.pre.length;\n        highlight.end = highlight.start + highlight.mid.length;\n\n        // compute point\n        var latitude = {};\n        latitude.degrees = parseFloat(match[3]);\n        latitude.minutes = (match[4] ? parseFloat(match[4]) : 0);\n        latitude.seconds = (match[6] ? parseFloat(match[6]) : 0);\n        latitude.hemisphere = match[8];\n\n        var longitude = {};\n        longitude.degrees = parseFloat(match[9]);\n        longitude.minutes = (match[10] ? parseFloat(match[10]) : 0);\n        longitude.seconds = (match[11] ? parseFloat(match[11]) : 0);\n        longitude.hemisphere = match[14];\n\n        var lat = degrees_to_decimal(latitude);\n        var lng = degrees_to_decimal(longitude);\n\n        highlight.feature = {};\n        highlight.feature.type = \"Feature\";\n        highlight.feature.geometry = {};\n        highlight.feature.geometry.type = \"Point\";\n        highlight.feature.geometry.coordinates = [lng, lat];\n\n        highlight.feature.properties = {};\n        highlight.feature.properties.name = highlight.mid;\n        highlight.feature.properties.popupContent = highlight.feature.properties.name;\n\n        emit(doc._id, highlight.feature);\n      }\n      // 0329a27c913419672bb58e73f4029119 (I think this has lat/lon flipped\n\n      pattern = /(.{0,64})\\b((\\d+(\\.\\d+)?)[°]\\s*([W|E])[,]?\\s*(\\d+(\\.\\d+)?)[°]\\s*([S|N]))(.{0,64})/igm;\n\n      while (match = pattern.exec(text)) {\n\n        var highlight = {};\n        var n = match.length;\n\n        highlight.pre = match[1];\n        highlight.mid = match[2];\n        highlight.post = match[n - 1];\n\n        highlight.start = match.index + highlight.pre.length;\n        highlight.end = highlight.start + highlight.mid.length;\n\n        // compute point\n        var latitude = {};\n        latitude.degrees = parseFloat(match[6]);\n        latitude.hemisphere = match[8];\n\n        var longitude = {};\n        longitude.degrees = parseFloat(match[3]);\n        longitude.hemisphere = match[5];\n\n        var lat = degrees_to_decimal(latitude);\n        var lng = degrees_to_decimal(longitude);\n\n        highlight.feature = {};\n        highlight.feature.type = \"Feature\";\n        highlight.feature.geometry = {};\n        highlight.feature.geometry.type = \"Point\";\n        highlight.feature.geometry.coordinates = [lng, lat];\n\n        highlight.feature.properties = {};\n        highlight.feature.properties.name = highlight.mid;\n        highlight.feature.properties.popupContent = highlight.feature.properties.name;\n \n        emit(doc._id, highlight.feature);\n      }\n\n      // 6ccbc16b63e464b365a794e46f002ce4\n      // http://biostor.org/reference/95646\n\n      pattern = /(.{0,64})\\b((\\d+\\.\\d+)\\s*([N|S])[-]\\s*(\\d+\\.\\d+)\\s*([W|E]))(.{0,64})/igm;\n\n      while (match = pattern.exec(text)) {\n\n        var highlight = {};\n        var n = match.length;\n\n        highlight.pre = match[1];\n        highlight.mid = match[2];\n        highlight.post = match[n - 1];\n\n        highlight.start = match.index + highlight.pre.length;\n        highlight.end = highlight.start + highlight.mid.length;\n\n        // compute point\n        var latitude = {};\n        latitude.degrees = parseFloat(match[3]);\n        latitude.hemisphere = match[4];\n\n        var longitude = {};\n        longitude.degrees = parseFloat(match[5]);\n        longitude.hemisphere = match[6];\n\n        var lat = degrees_to_decimal(latitude);\n        var lng = degrees_to_decimal(longitude);\n\n        highlight.feature = {};\n        highlight.feature.type = \"Feature\";\n        highlight.feature.geometry = {};\n        highlight.feature.geometry.type = \"Point\";\n        highlight.feature.geometry.coordinates = [lng, lat];\n\n        highlight.feature.properties = {};\n        highlight.feature.properties.name = highlight.mid;\n        highlight.feature.properties.popupContent = highlight.feature.properties.name;\n        \n        emit(doc._id, highlight.feature);\n      }\n    }\n  }\n}"
        }
    },
    "language": "javascript"
}