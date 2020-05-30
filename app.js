// api variable
const api = "https://www.scorebat.com/video-api/v1/";

// variable html containers
const body = document.querySelector("body");
const input = document.querySelector("input");
const searchIcon = document.querySelector(".search-icon");
const highlightsReel = document.querySelector(".highlights-reel");
const videoModal = document.querySelector("#player");
const videoPlayer = document.querySelector(".video-player");
const searchNull = document.querySelector(".search-null");

// create video links
const createLinks = (videoEmbedArray) => {
  let videoLinks = document.querySelectorAll(".card");

  videoLinks.forEach((item) => {
    item.addEventListener("click", () => {
      let id = item.id.slice(5);
      let videoDiv = videoEmbedArray[id];

      videoModal.classList.toggle("hide");
      body.classList.toggle("no-scroll");
      videoPlayer.innerHTML = videoDiv;
    });
  });

  videoModal.addEventListener("click", () => {
    videoModal.classList.toggle("hide");
    body.classList.toggle("no-scroll");
    videoPlayer.innerHTML = "";
  });

  ScrollReveal().reveal(".card");
};

// get flag emoji
const getFlag = (flag) => {
  if (flag === "england") {
    let icon = "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
    return icon;
  } else if (flag === "germany") {
    let icon = "🇩🇪";
    return icon;
  } else if (flag === "spain") {
    let icon = "🇪🇸";
    return icon;
  } else if (flag === "france") {
    let icon = "🇫🇷";
    return icon;
  } else if (flag === "italy") {
    let icon = "🇮🇹";
    return icon;
  } else if (flag === "hungary") {
    let icon = "🇭🇺";
    return icon;
  } else if (flag === "poland") {
    let icon = "🇵🇱";
    return icon;
  } else if (flag === "serbia") {
    let icon = "🇷🇸";
    return icon;
  } else if (flag === "belarus") {
    let icon = "🇧🇾";
    return icon;
  } else if (flag === "korea republic") {
    let icon = "🇰🇷";
    return icon;
  } else if (flag === "international") {
    let icon = "🌎";
    return icon;
  } else if (flag === "champions league" || flag === "europa league") {
    let icon = "🇪🇺";
    return icon;
  }
};

// render the highlights
const renderHighlights = (highlights, videoEmbedArray) => {
  let list = "";
  let counter = 0;

  for (index in highlights) {
    // date formatting
    let trimDate = highlights[index].date.slice(0, 10);
    let day = trimDate.slice(8, 10);
    let month = trimDate.slice(5, 7);
    let year = trimDate.slice(0, 4);
    let cleanDate = `${day}-${month}-${year}`;

    // competition name
    let competitionName = highlights[index].competition.name;
    competitionName = competitionName.substring(
      competitionName.indexOf(":") + 2
    );

    // country flag
    let flag = highlights[index].competition.name;
    flag = flag.split(":").shift().toLowerCase();
    getFlag(flag);

    // embedded video
    let videoEmbed = highlights[index].videos[0].embed;
    videoEmbedArray.push(videoEmbed);
    videoEmbed = "";

    // write out cards
    list += `<div class="card" id="video${counter}">    
              <div class="thumb" style="background-image: url('${highlights[index].thumbnail}');">
                <i class="far fa-play-circle fa-4x play-icon"></i>
              </div>
                <div class="highlight-content">
                  <div class="teams">
                    <div>${highlights[index].side1.name}</div>                      
                    <div class="team-icon">Home</div>
                    <div>${highlights[index].side2.name}</div>
                    <div class="team-icon">Away</div>
                  </div>                    
                  <div class="info">
                      
                      <p>${flag} ${competitionName}</p>
                    <p>${cleanDate}</p>
                  </div>
                </div>
              </div>`;

    // video counter
    counter++;
  }
  highlightsReel.innerHTML = list;
  // return embed array to create links next
  return videoEmbedArray;
};

// start process of getting and displaying highlights
const getHighlights = async (highlights) => {
  let videoEmbedArray = [];
  await renderHighlights(highlights, videoEmbedArray);
  await createLinks(videoEmbedArray);
};

// filter highlights via keystroke
const filterHighlights = (highlights) => {
  // find search keywords
  let keyword = input.value.toLowerCase();
  let filteredHighlights = highlights.filter((highlight) => {
    const regex = new RegExp(keyword, "gi");
    return (
      highlight.title.match(regex) || highlight.competition.name.match(regex)
    );
  });

  // return search error if no results are found
  if (filteredHighlights.length < 1) {
    searchNull.innerHTML = `<div class="search-message">Search not found ...</div>`;
  } else {
    searchNull.innerHTML = "";
  }

  // get filtered highlights
  getHighlights(filteredHighlights);
};

// start application
const app = (highlights) => {
  // get initial highlights
  getHighlights(highlights);

  // filter highlights on text input
  input.addEventListener("keyup", (e) => {
    filterHighlights(highlights);
  });

  // search icon animation on focus/off focus
  ["focus", "focusout"].forEach((e) =>
    input.addEventListener(e, () => {
      searchIcon.classList.toggle("hide");
    })
  );
};

// get api
const getApi = () => {
  axios
    .get(api)
    .then(function (response) {
      const highlights = response.data;
      app(highlights);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};

// start
getApi();
