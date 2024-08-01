// dropdown

function toggleDropdown(dropdownId) {
  console.log(`Toggling dropdown with ID: ${dropdownId}`);
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle('show');
  } else {
    console.error(`Dropdown element with ID ${dropdownId} not found`);
  }
}

window.onclick = function (event) {
  if (!event.target.matches('.dropdown-trigger')) {
    const dropdowns = document.getElementsByClassName('dropdown-content');
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// searchbox
function showSearchBox() {
  const searchBox = document.getElementById('search-box');
  searchBox.classList.add('show');
}

function hideSearchBox() {
  const searchBox = document.getElementById('search-box');
  searchBox.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', (event) => {
  const searchIcon = document.querySelector('.search-icon');
  const searchBox = document.getElementById('search-box');
  const closeBtn = document.querySelector('.search-box .close');

  searchIcon.addEventListener('click', () => {
    searchBox.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    searchBox.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target == searchBox) {
      searchBox.style.display = 'none';
    }
  });
});

function handleSearchSubmit(event) {
  event.preventDefault();
  searchBox.style.display = 'none';
  window.location.href = '#';
  return false;
}




//carousel

$(document).ready(function () {
  $('.carousel').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 1,
    prevArrow: '<button class="slick-prev custom-prev"><i class="fa fa-chevron-left"></i></button>',
    nextArrow: '<button class="slick-next custom-next"><i class="fa fa-chevron-right"></i></button>',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: false
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  });
});

//News API
async function fetchNews() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/younginnovations/internship-challenges/master/front-end/news_list.json');
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }
    const data = await response.json();
    return data.news;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

let currentPage = 0;
const pageSize = 6;
let newsArticles = [];
let isShowingAllNews = false;

async function displayNews() {
  const newsSection = document.querySelector('.news .cards');

  try {
    if (newsArticles.length === 0) {
      newsArticles = await fetchNews();
    }

    if (!isShowingAllNews) {
      const initialNews = newsArticles.slice(0, pageSize);
      renderNews(newsSection, initialNews);
    } else {
      renderNews(newsSection, newsArticles);
    }

    toggleViewMoreButton();

  } catch (error) {
    console.error('Error displaying news:', error);
  }
}

function renderNews(newsSection, articles) {
  let newsHTML = '';

  articles.forEach((article) => {
    const articleHTML = `
          <div class="card fade-in">
              <img src="${article.image}" alt="${article.title}">
              <div class="card-content">
                  <h3>${article.title}</h3>
                  <p>${article.content}</p>
                  <a href="#" class="learn-more">Learn more</a>
              </div>
          </div>
      `;
    newsHTML += articleHTML;
  });

  newsSection.innerHTML = newsHTML;
  addLearnMoreEventListeners();
  fadeElementsOnScroll();
}

function addLearnMoreEventListeners() {
  const learnMoreLinks = document.querySelectorAll('.learn-more');

  learnMoreLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const cardContent = event.target.previousElementSibling;

      if (cardContent.style.webkitLineClamp === 'none') {
        cardContent.style.display = '-webkit-box';
        cardContent.style.webkitLineClamp = 3;
        event.target.textContent = 'Learn more';
      } else {
        cardContent.style.display = 'block';
        cardContent.style.webkitLineClamp = 'none';
        event.target.textContent = 'Show less';
      }
    });
  });
}

function fadeElementsOnScroll() {
  const newsCards = document.querySelectorAll('.card');

  const fadeInObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  newsCards.forEach(card => {
    fadeInObserver.observe(card);
  });
}

function toggleViewMoreButton() {
  const viewMoreButton = document.getElementById('view-more');
  if (isShowingAllNews) {
    viewMoreButton.textContent = 'View Less';
  } else {
    viewMoreButton.textContent = 'View More';
  }
}

document.getElementById('view-more').addEventListener('click', () => {
  isShowingAllNews = !isShowingAllNews;
  displayNews();
});

window.onload = async function () {
  await displayNews();
};
