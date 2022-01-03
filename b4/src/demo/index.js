import demoPageIndex from './index.html?raw';

const startLessonDemo = () => {
  document.body.innerHTML = demoPageIndex;

  // construct return url for all review buttons on the demo page
  const reviewLinks = document.querySelectorAll('a.btn[review]');
  Array.from(reviewLinks).forEach((link) => {
    link.href = `${link.href}&is_demo=on&return_url=${window.location.href}`;
  });

  // if there is a direct link to a commit deployed to staging, keep using it
  const commitSha = new URLSearchParams(window.location.search).get('commit_sha');

  // add standard flags for trainer or lesson buttons on demo page
  const trainerLinks = document.querySelectorAll('a.btn:not([review])');
  Array.from(trainerLinks).forEach((link) => {
    let retUrl = `return_url=${window.location.href}`;
    let learningActivityId = `learningActivityId=mocked-uncompleted-lesson-id&`;
    let referAFriend = `is_refer_a_friend=off&`;
    let isDemo = '&is_demo=on&';
    let directLink = commitSha ? `commit_sha=${commitSha}&` : '';
    link.href = `${link.href}${isDemo}${directLink}${learningActivityId}${referAFriend}${retUrl}`.replace('?&', '?');
  });
};

export default startLessonDemo;
