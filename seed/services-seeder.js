var Services = require("../models/services"),
    mongoose = require("mongoose"),
    categories = require("../models/categories");
const Service = Services.model;
const { exists } = require("../models/services");

mongoose.connect(process.env.DBCREDINTIALS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        console.log('Connected to DB!');
        seed();
    })
    .catch(error => console.log(error.message));

var services = [
    new Service({
        id: 0,
        name: "Likes",
        category: "Instagram",
        rate: 0.79,
        quality: "MQ",
        guaranteed: "No"
    }),
    new Service({
        id: 1,
        name: "Likes",
        category: "Instagram",
        rate: 2.73,
        quality: "Real",
        guaranteed: "Yes"
    }),
    new Service({
        id: 2,
        name: "Likes",
        category: "Instagram",
        rate: 1.72,
        quality: "HQ",
        guaranteed: "Non Drop"
    }),
    new Service({
        id: 3,
        name: "Likes",
        category: "Instagram",
        rate: 0.90,
        quality: "LQ",
        guaranteed: "No"
    }),
    new Service({
        id: 4,
        name: "Followers",
        category: "Instagram",
        rate: 0.84,
        quality: "BOTS",
        guaranteed: "No"
    }), new Service({
        id: 5,
        name: "Followers",
        category: "Instagram",
        rate: 1.95,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 6,
        name: "Followers",
        category: "Instagram",
        rate: 2.76,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 7,
        name: "Views + Impression",
        category: "Instagram",
        rate: 0.02,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 8,
        name: "IGTV Views",
        category: "Instagram",
        rate: 0.03,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 9,
        name: "Custom Comments",
        category: "Instagram",
        rate: 8.30,
        quality: "HQ",
        guaranteed: "Non Drop"
    }), new Service({
        id: 10,
        name: "Random Comments",
        category: "Instagram",
        rate: 8,
        quality: "HQ",
        guaranteed: "Non Drop"
    }), new Service({
        id: 11,
        name: "Saves",
        category: "Instagram",
        rate: 0.10,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 12,
        name: "Story Views",
        category: "Instagram",
        rate: 0.28,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 13,
        name: "Highlights Views",
        category: "Instagram",
        rate: 1.44,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 14,
        name: "Profile Visits + Impression + Reach",
        category: "Instagram",
        rate: 0.61,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 15,
        name: "Highlights Views",
        category: "Instagram",
        rate: 1.44,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Post Likes",
        category: "Facebook",
        rate: 1.37,
        quality: "LQ",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Page Likes",
        category: "Facebook",
        rate: 6.34,
        quality: "HQ",
        guaranteed: "Refill"
    }), new Service({
        id: 2,
        name: "Post Likes",
        category: "Facebook",
        rate: 1.98,
        quality: "MQ",
        guaranteed: "Yes"
    }), new Service({
        id: 3,
        name: "Random Comments",
        category: "Facebook",
        rate: 56.3,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 4,
        name: "Custom Comments",
        category: "Facebook",
        rate: 81,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Views",
        category: "Youtube",
        rate: 1.36,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Targeted Views",
        category: "Youtube",
        rate: 1.84,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 2,
        name: "Targeted Ads Views",
        category: "Youtube",
        rate: 2.88,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 3,
        name: "Likes",
        category: "Youtube",
        rate: 1.71,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 4,
        name: "Subscribers",
        category: "Youtube",
        rate: 14.20,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 5,
        name: "Shares",
        category: "Youtube",
        rate: 1.43,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 6,
        name: "Random Comments",
        category: "Youtube",
        rate: 42.88,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 7,
        name: "Custom Comments",
        category: "Youtube",
        rate: 57.10,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 8,
        name: "Comment Like",
        category: "Youtube",
        rate: 3.32,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 9,
        name: "Comment Dislike",
        category: "Youtube",
        rate: 3.32,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 10,
        name: "Dislikes",
        category: "Youtube",
        rate: 13.70,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 11,
        name: "Social Shares",
        category: "Youtube",
        rate: 1.24,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Channels",
        category: "WhatsApp",
        rate: 230,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Targeted Channels",
        category: "WhatsApp",
        rate: 600,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 2,
        name: "Advertisements Messages",
        category: "WhatsApp",
        rate: 25,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Followers",
        category: "Twitter",
        rate: 5.41,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Votes",
        category: "Twitter",
        rate: 0.97,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 2,
        name: "Video Views",
        category: "Twitter",
        rate: 0.34,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 3,
        name: "Impression / Hashtag click / Profile click",
        category: "Twitter",
        rate: 0.35,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 4,
        name: "Retweets",
        category: "Twitter",
        rate: 4.11,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Views",
        category: "Tiktok",
        rate: 0.01,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Likes",
        category: "Tiktok",
        rate: 1.15,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 2,
        name: "Followers",
        category: "Tiktok",
        rate: 4.71,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 3,
        name: "Shares",
        category: "Tiktok",
        rate: 2.89,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 4,
        name: "Custom / Random Comments",
        category: "Tiktok",
        rate: 11.41,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Followers",
        category: "LinkedIn",
        rate: 7.2,
        quality: "Real",
        guaranteed: "Refill"
    }), new Service({
        id: 0,
        name: "Group / Channel Members",
        category: "Telegram",
        rate: 0.91,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Post Views",
        category: "Telegram",
        rate: 0.25,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 2,
        name: "Votes",
        category: "Telegram",
        rate: 1.73,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 0,
        name: "Premium / Free Plays",
        category: "Spotify",
        rate: 0.75,
        quality: "HQ",
        guaranteed: "Non Drop"
    }), new Service({
        id: 1,
        name: "User Followers",
        category: "Spotify",
        rate: 1.21,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 2,
        name: "Track Plays",
        category: "Spotify",
        rate: 0.9,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 3,
        name: "Saves",
        category: "Spotify",
        rate: 1.52,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 4,
        name: "Premium Saves",
        category: "Spotify",
        rate: 4.11,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 0,
        name: "Plays",
        category: "SoundCloud",
        rate: 0.03,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 1,
        name: "Likes",
        category: "SoundCloud",
        rate: 1.72,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 2,
        name: "Followers",
        category: "SoundCloud",
        rate: 2.06,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 3,
        name: "Reposts",
        category: "SoundCloud",
        rate: 3.88,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 4,
        name: "Random Comments",
        category: "SoundCloud",
        rate: 4.26,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 0,
        name: "Followers",
        category: "Pinterest",
        rate: 2.44,
        quality: "Real",
        guaranteed: "Refill"
    }), new Service({
        id: 1,
        name: "Pin Likes",
        category: "Pinterest",
        rate: 2.65,
        quality: "Real",
        guaranteed: "Refill"
    }), new Service({
        id: 2,
        name: "Repins",
        category: "Pinterest",
        rate: 3.05,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Plays",
        category: "Shazam",
        rate: 1.53,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 0,
        name: "Targeted Business Reviews",
        category: "Google",
        rate: 5750,
        quality: "Real",
        guaranteed: "Lifetime"
    }), new Service({
        id: 1,
        name: "Visitors",
        category: "Google",
        rate: 1.34,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 0,
        name: "Group Followers / Page Friends",
        category: "VK",
        rate: 4.41,
        quality: "MQ",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Views",
        category: "VK",
        rate: 0.89,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Views",
        category: "Dailymotion",
        rate: 1.29,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Followers",
        category: "Tumblr",
        rate: 3.14,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Likes / Reblogs",
        category: "Tumblr",
        rate: 2.69,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Channel Views",
        category: "Twitch",
        rate: 0.42,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Clip Views",
        category: "Twitch",
        rate: 0.51,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 2,
        name: "Followers",
        category: "Twitch",
        rate: 0.83,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 3,
        name: "Prime Subscribers",
        category: "Twitch",
        rate: 1.89,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Followers",
        category: "Periscope",
        rate: 3.13,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Likes",
        category: "Periscope",
        rate: 0.72,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Plays / Profile Views",
        category: "Datpiff",
        rate: 0.94,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Video Views",
        category: "Vimeo",
        rate: 0.78,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 1,
        name: "Followers / Likes",
        category: "Vimeo",
        rate: 4.08,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Plays",
        category: "Mixcloud",
        rate: 0.95,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Android",
        category: "Mobile App Installs",
        rate: 98,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "IOS",
        category: "Mobile App Installs",
        rate: 324,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 2,
        name: "Targeted Android",
        category: "Mobile App Installs",
        rate: 124,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Votes",
        category: "IMDB",
        rate: 27.43,
        quality: "Real",
        guaranteed: "Lifetime"
    }), new Service({
        id: 1,
        name: "Views",
        category: "IMDB",
        rate: 2.87,
        quality: "Real",
        guaranteed: "Lifetime"
    }), new Service({
        id: 0,
        name: "Likes / Downloads",
        category: "Spreaker",
        rate: 2.84,
        quality: "Real",
        guaranteed: "Lifetime"
    }), new Service({
        id: 1,
        name: "Followers",
        category: "Spreaker",
        rate: 7.56,
        quality: "Real",
        guaranteed: "Lifetime"
    }), new Service({
        id: 2,
        name: "Random Comments",
        category: "Spreaker",
        rate: 8.77,
        quality: "Real",
        guaranteed: "Lifetime"
    }), new Service({
        id: 0,
        name: "Targeted",
        category: "Web Traffic",
        rate: 0.79,
        quality: "Real",
        guaranteed: "Non Drop"
    }), new Service({
        id: 0,
        name: "Reviews",
        category: "TripAdvisor",
        rate: 5755,
        quality: "Real",
        guaranteed: "Lifetime"
    }), new Service({
        id: 0,
        name: "Likes / Shares / Followers",
        category: "Quora",
        rate: 17.58,
        quality: "Real",
        guaranteed: "Yes"
    }), new Service({
        id: 0,
        name: "Followers",
        category: "Likee",
        rate: 8.26,
        quality: "HQ",
        guaranteed: "Yes"
    }), new Service({
        id: 1,
        name: "Shares / Views",
        category: "Likee",
        rate: 2.71,
        quality: "Real",
        guaranteed: "Refill"
    }), new Service({
        id: 2,
        name: "Likes",
        category: "Likee",
        rate: 3.99,
        quality: "Real",
        guaranteed: "Refill"
    }),
];
function seed() {

    services.forEach(function (service) {
        categories.findOne({ name: service.category }, function (err, found) {
            found.services.push(service);
            found.save(function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        });
    });
}