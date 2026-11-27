/**
 * 명도재 이명우의 바이브 코딩연구소 - 메인 통합 포털 스크립트
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('명도재 이명우의 바이브 코딩연구소 통합 포털 가동 중');

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
