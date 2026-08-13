const apiKey = process.env.YOUTUBE_API_KEY;
const channelId = process.env.YOUTUBE_CHANNEL_ID;

async function test() {
  const key = process.env.YOUTUBE_API_KEY;
  const channel = process.env.YOUTUBE_CHANNEL_ID;
  
  const searchRes = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${channel}&part=id&order=date&maxResults=50&type=video`
  );
  const searchData = await searchRes.json();
  
  if (!searchData.items) {
    console.log("No items", searchData);
    return;
  }
  
  const videoIds = searchData.items.map(item => item.id.videoId).join(',');
  console.log("Video IDs:", videoIds);
  
  const videoRes = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?key=${key}&id=${videoIds}&part=contentDetails`
  );
  const videoData = await videoRes.json();
  
  videoData.items.forEach(item => {
    console.log(item.id, item.contentDetails.duration);
  });
}

test();
