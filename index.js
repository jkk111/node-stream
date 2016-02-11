var fs = require("fs");
var vids = __dirname;
module.exports = function(vidRoot) {
  vids = vidRoot;
  return streamVideo;
}
function streamVideo(req, res, next) {
    var video = req.params.video;
  if(!video)
    next();
  else {
    var pos = req.headers.range.replace(/bytes=/, "").split("-");
    var start = parseInt(pos[0], 10);
    fs.stat(video, function(err, stats) {
      var total = stats.size;
      var end = pos[1] ? parseInt(pos[1], 10) : total - 1;
      var chunksize = (end - start) - 1;
      res.status(206)
      .set({
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4"
      })
      var stream = fs.createReadStream(vids + "/" + video, { start: start, end: end })
      .on("open", function() {
        stream.pipe(res);
      })
      .on("error", function(err) {
        res.end(err);
      })
    });
  }
}
