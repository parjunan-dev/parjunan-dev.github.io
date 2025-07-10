document.addEventListener("DOMContentLoaded", function () {
  let activeTab = "youtube"; // Default tab

  function loadPlaylists(tabName) {
    const playlistGroups = document.getElementById("playlistGroups");
    playlistGroups.innerHTML = ""; // Clear previous playlists
    // Clear description and reset video player when tab changes
    document.getElementById("mainVideoDescription").innerHTML =
      "<h2>Welcome</h2><p>Select a video from the playlist.</p>";
    document.getElementById("mainVideoPlayer").src = "about:blank"; // Or a placeholder page

    let playlistUrl = "";
    if (tabName === "youtube") {
      playlistUrl = "../videoplaylist/webexaiplaylist.json";
    } else if (tabName === "vidcast") {
      playlistUrl = "../videoplaylist/webexccplaylist.json";
    } else if (tabName === "customerref") {
      // New case for customer references
      playlistUrl = "../videoplaylist/customerref.json";
    } else if (tabName === "customerassist") {
      playlistUrl = "../videoplaylist/customerassist.json";
    } else {
      console.error("Unknown tab name:", tabName);
      return;
    }

    fetch(playlistUrl)
      .then((response) => response.json())
      .then((playlists) => {
        playlists.forEach((group, groupIndex) => {
          const groupDiv = document.createElement("div");
          groupDiv.className = "playlist-group";

          const groupTitle = document.createElement("h4");
          groupTitle.textContent = group.group;
          groupDiv.appendChild(groupTitle);

          group.videos.forEach((video, videoIndex) => {
            const videoItem = document.createElement("div");
            videoItem.className = "playlist-video";

            videoItem.innerHTML = `
              <img src="${video.thumbnail}" alt="${video.title}" />
              <div class="video-info">
                <h5>${video.title}</h5>
                <p>${video.subtitle || ""}</p>
              </div>
            `;

            videoItem.addEventListener("click", () => {
              const player = document.getElementById("mainVideoPlayer");
              if (video.videoId) {
                player.src = `https://www.youtube.com/embed/${video.videoId}`;
              } else if (
                video.videoUrl &&
                video.videoUrl.includes("youtube.com/embed")
              ) {
                player.src = video.videoUrl;
              } else {
                console.warn(
                  "Video source not found or not a YouTube link for:",
                  video.title
                );
                player.src = "about:blank";
              }

              const formattedDescription = video.description
                .replace(/\n/g, "<br>")
                .replace(
                  /(https?:\/\/[^\s<]+)/g,
                  '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
                );

              document.getElementById("mainVideoDescription").innerHTML = `
                <h2>${video.title}</h2>
                <p>${formattedDescription}</p>
              `;
            });

            groupDiv.appendChild(videoItem);

            if (groupIndex === 0 && videoIndex === 0) {
              const player = document.getElementById("mainVideoPlayer");
              if (video.videoId) {
                player.src = `https://www.youtube.com/embed/${video.videoId}`;
              } else if (
                video.videoUrl &&
                video.videoUrl.includes("youtube.com/embed")
              ) {
                player.src = video.videoUrl;
              } else {
                console.warn(
                  "Initial video source not found or not a YouTube link for:",
                  video.title
                );
                player.src = "about:blank";
              }

              const formattedDescription = video.description
                .replace(/\n/g, "<br>")
                .replace(
                  /(https?:\/\/[^\s<]+)/g,
                  '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
                );

              document.getElementById("mainVideoDescription").innerHTML = `
                <h2>${video.title}</h2>
                <p>${formattedDescription}</p>
              `;
            }
          });

          playlistGroups.appendChild(groupDiv);
        });
      })
      .catch((error) =>
        console.error(
          "Failed to load video playlists for tab " + tabName + ":",
          error
        )
      );
  }

  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".tab-button")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeTab = button.dataset.tab;
      loadPlaylists(activeTab);
    });
  });

  loadPlaylists(activeTab);

  initializeMobileNavToggle(); // Call the new function
});

// Mobile Nav Toggle Functionality (Copied here for videos.html)
function initializeMobileNavToggle() {
  const toggleButton = document.querySelector(".mobile-nav-toggle");
  // On videos.html, the menu ID is mobileNavMenuVideos
  const mobileMenu = document.getElementById("mobileNavMenuVideos");

  if (toggleButton && mobileMenu) {
    toggleButton.addEventListener("click", () => {
      const isActive = mobileMenu.classList.contains("active");
      mobileMenu.classList.toggle("active");
      toggleButton.classList.toggle("active");
      toggleButton.setAttribute("aria-expanded", !isActive);

      if (!isActive) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }
}
// END Mobile Nav Toggle Functionality
