var request = require('request');
//var Excel = require('exceljs');
const fs = require('fs');
var user_id = "YOUR_USERNAME";

async function all_profile_data(user_id, book_name){
  var instagram_base_url = "https://www.instagram.com/"+ user_id +"/?__a=1";

  var user_followers, user_following, user_total_likes, user_total_comments, user_total_posts, user_engagement_ratio;
  request({
    uri : instagram_base_url,
  }, function(error, response, body){
          if(error){
            console.log('error');
          }
          var source = body;
          var data = JSON.parse(source);
          user_followers = data.graphql.user.edge_followed_by.count;
          user_following = data.graphql.user.edge_follow.count;
          user_total_posts = data.graphql.user.edge_owner_to_timeline_media.count;
          var medias = data.graphql.user.edge_owner_to_timeline_media;
          var followers = user_followers;
          var totalComments = 0, totalLikes = 0;
          for (var i = 0; i < 12; i++) {
            totalComments += parseInt(medias.edges[i].node.edge_media_to_comment.count);
          };
          for (var l = 0; l < 12; l++) {
            totalLikes += parseInt(medias.edges[l].node.edge_media_preview_like.count);
          };
          var engagementRatio = ((totalLikes + totalComments) / followers) / 12;
          user_total_comments = totalComments;
          user_total_likes = totalLikes;
          user_engagement_ratio = engagementRatio;
          var user_date = new Date();
          data_to_append = user_date.toString() + ',' + user_followers.toString() + ',' + user_following.toString() + ',' + user_total_likes.toString() + ',' + user_total_comments.toString() + ',' + user_total_posts.toString() + ',' + user_engagement_ratio.toString() + '\n';
          fs.appendFile('analytics.csv', data_to_append , function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
  })
}

all_profile_data(user_id, "analytics");
