// home-animation.ts - 포켓몬 인트로 애니메이션 로직

let homeMusic: HTMLAudioElement | null = null; // 홈 음악 객체를 전역으로 관리
let introMusic: HTMLAudioElement | null = null; // 인트로 음악 객체 추가

// 음악 초기화 함수 (자동재생 안함)
export function initHomeMusic(): HTMLAudioElement {
  if (!homeMusic) {
    const homeMusicSrc = '/music/intro-music.mp3';
    homeMusic = new Audio(homeMusicSrc);
    homeMusic.volume = 0.5;
    homeMusic.loop = true;
  }
  return homeMusic;
}

// 인트로 음악 초기화 함수
function initIntroMusic(): HTMLAudioElement {
  if (!introMusic) {
    introMusic = new Audio('/music/red-intro.mp3'); // 13번 요구사항
    introMusic.volume = 0.5;
  }
  return introMusic;
}

// 음악 재생 함수
export function playHomeMusic(): void {
  if (homeMusic) {
    homeMusic.play().catch(error => {
      console.warn('홈 음악 재생 실패:', error);
    });
  }
}

// 인트로 애니메이션 실행 함수
export function startIntroAnimation(): void {
  const introAnimation = document.querySelector(
    '.intro-animation',
  ) as HTMLElement;
  const introText = document.querySelector('.intro-text') as HTMLElement;
  const introTextImg = document.querySelector('.intro-text img') as HTMLElement;
  const skip = document.querySelector('.skip') as HTMLElement;
  const bigStar = document.querySelector('.big-star') as HTMLElement;
  const gameFreak = document.querySelectorAll('.game-freak')[0] as HTMLElement; // 첫 번째 game-freak 요소
  const gameFreakStar = document.querySelectorAll(
    '.game-freak',
  )[1] as HTMLElement; // 두 번째 game-freak 요소 (실제로는 game-freak-star)
  const leftPokemon = document.querySelector('.left-pokemon') as HTMLElement;
  const rightPokemon = document.querySelector('.right-pokemon') as HTMLElement;
  const rightPokemonImg = document.querySelector(
    '.right-pokemon img',
  ) as HTMLElement;

  // 홈 화면 요소들 추가 선택 (14-15번 요구사항)
  const projectLogo = document.querySelector('.project-logo') as HTMLElement;
  const pressStart = document.querySelector('.press-start') as HTMLElement;
  const help = document.querySelector('.help') as HTMLElement;
  const githubLink = document.querySelector('.github-link') as HTMLElement;
  const ballCanvas = document.querySelector('#ballCanvas') as HTMLElement; // ballCanvas 추가

  if (!introAnimation) return;

  // 인트로 음악 초기화 및 재생 (13번 요구사항)
  const introMusicObj = initIntroMusic();
  introMusicObj.play().catch(error => {
    console.warn('인트로 음악 재생 실패:', error);
  });

  // 홈 화면 요소들 초기 상태 설정 (14-15번 요구사항)
  if (projectLogo) {
    projectLogo.style.transform = 'translateY(-100vh)'; // 화면 위쪽 밖으로
    projectLogo.style.transition = 'none';
  }
  if (pressStart) {
    pressStart.style.opacity = '0';
    pressStart.style.transition = 'none';
  }
  if (help) {
    help.style.opacity = '0';
    help.style.transition = 'none';
  }
  if (githubLink) {
    githubLink.style.opacity = '0';
    githubLink.style.transition = 'none';
  }
  // ballCanvas 초기 상태 설정
  if (ballCanvas) {
    ballCanvas.style.opacity = '0';
    ballCanvas.style.transition = 'none';
  }
  // ballCanvas 초기 상태 설정 (수정사항 2번)
  if (ballCanvas) {
    ballCanvas.style.opacity = '0';
    ballCanvas.style.transition = 'none';
  }

  // skip 버튼 클릭 이벤트 - 즉시 애니메이션 종료 (트랜지션 없이) (4번 추가사항)
  if (skip) {
    skip.addEventListener('click', () => {
      // 인트로 음악 중지
      if (introMusicObj) {
        introMusicObj.pause();
        introMusicObj.currentTime = 0;
      }

      // 트랜지션 없이 즉시 사라지게
      introAnimation.style.transition = 'none';
      introAnimation.style.opacity = '0';
      introAnimation.style.display = 'none';

      // 홈 화면 요소들 즉시 표시
      if (projectLogo) {
        projectLogo.style.transform = 'translateY(0)';
      }
      if (pressStart) pressStart.style.opacity = '1';
      if (help) help.style.opacity = '1';
      if (githubLink) githubLink.style.opacity = '1';
      // ballCanvas도 즉시 표시
      if (ballCanvas) ballCanvas.style.opacity = '1';
      // ballCanvas도 즉시 표시 (수정사항 2번)
      if (ballCanvas) ballCanvas.style.opacity = '1';

      // 홈 음악 재생 시작
      playHomeMusic();
    });
  }

  // 1. skip버튼이 혼자 계속 투명도 0에서 1초 깜빡임(1초간격으로)
  if (skip) {
    // 1초 동안은 원래 색상 유지, 그 후에 필터 반전 (수정사항 1번)
    setTimeout(() => {
      skip.style.filter = 'invert(1)'; // 1초 후에 검은 배경에서도 보이게
    }, 1000);

    let skipBlinking = true;
    const skipInterval = setInterval(() => {
      if (skip && skipBlinking) {
        skip.style.opacity = skip.style.opacity === '1' ? '0' : '1';
      } else {
        clearInterval(skipInterval);
      }
    }, 1000); // 1초 간격

    // 전체 애니메이션 완료 시 깜빡임 중지
    setTimeout(() => {
      skipBlinking = false;
      clearInterval(skipInterval);
    }, 25000); // 전체 애니메이션 시간
  }

  // 2. 1초뒤에 .intro-text img가 나타남(opacity:1)
  setTimeout(() => {
    if (introTextImg) {
      introTextImg.style.opacity = '1'; // 트랜지션 없음 (1번 추가사항)
    }
  }, 1000);

  // 3. 그 후 3초 뒤에 intro-text 가 투명도 0으로 바로 사라짐
  setTimeout(() => {
    if (introText) {
      introText.style.opacity = '0'; // 트랜지션 없음 (1번 추가사항)
    }
    // game-freak가 바로 보이도록
    if (gameFreak) {
      gameFreak.style.opacity = '1';
    }
  }, 4000); // 1초 + 3초

  // 4. 그 후 1초 뒤에 big-star가 대각선으로 사라짐(1초동안)
  setTimeout(() => {
    if (bigStar) {
      bigStar.style.transition = 'transform 1s ease-in-out';
      bigStar.style.transform = 'translate(-110vw, 80vh) rotate(720deg)'; //  대각선으로 사라짐
    }
  }, 5000); // 4초 + 1초

  // 5. 그 후 1초 동안 game-freak-star가 3초 동안 나타남 (3단계로)
  setTimeout(() => {
    if (gameFreakStar) {
      // 3단계로 나타나는 효과
      gameFreakStar.style.opacity = '0.3';
      setTimeout(() => {
        if (gameFreakStar) gameFreakStar.style.opacity = '0';
      }, 500);
      setTimeout(() => {
        if (gameFreakStar) gameFreakStar.style.opacity = '1';
      }, 1000);
      setTimeout(() => {
        if (gameFreakStar) gameFreakStar.style.opacity = '0.3';
      }, 1500);
      setTimeout(() => {
        if (gameFreakStar) gameFreakStar.style.opacity = '1';
      }, 2000);
    }
  }, 6000); // 5초 + 1초

  // 6. 그후 game-freak와 game-freak-star가 바로 사라지고 2초동안 포켓몬들이 제자리로
  setTimeout(() => {
    if (gameFreak) gameFreak.style.opacity = '0'; // 5번 추가사항 확인
    if (gameFreakStar) gameFreakStar.style.opacity = '0'; // 5번 추가사항 확인

    // 포켓몬들이 제자리로 (2초동안)
    if (leftPokemon) {
      leftPokemon.style.transition = 'transform 2s ease-out';
      leftPokemon.style.transform = 'translateX(0)';
    }
    if (rightPokemon) {
      rightPokemon.style.transition = 'transform 2s ease-out';
      rightPokemon.style.transform = 'translateX(0)';
    }
  }, 9000); // 6초 + 3초

  // 7. 포켓몬이 제자리로 돌아오자마자 right-pokemon img가 점프 두번 (총 2초동안)
  setTimeout(() => {
    if (rightPokemonImg) {
      rightPokemonImg.style.transition = 'transform 0.5s ease';
      rightPokemonImg.style.transform = 'translateY(5%)';

      setTimeout(() => {
        rightPokemonImg.style.transform = 'translateY(0%)';
      }, 500);

      setTimeout(() => {
        rightPokemonImg.style.transform = 'translateY(5%)';
      }, 1000);

      setTimeout(() => {
        rightPokemonImg.style.transform = 'translateY(0%)';
      }, 1500);
    }
  }, 11000); // 9초 + 2초

  // 8. 그 후 포켓몬들이 5%로 x축이동 (1초동안)
  setTimeout(() => {
    if (leftPokemon) {
      leftPokemon.style.transition = 'transform 1s ease';
      leftPokemon.style.transform = 'translateX(15%)';
    }
    if (rightPokemon) {
      rightPokemon.style.transition = 'transform 1s ease';
      rightPokemon.style.transform = 'translateX(5%)';
    }
  }, 13000); // 11초 + 2초

  // 9. 그 후 1초 동안 기달

  // 10. 그 후 1초동안 다시 right-pokemon img가 점프 한번 (총 1초동안)
  setTimeout(() => {
    if (rightPokemonImg) {
      rightPokemonImg.style.transition = 'transform 0.5s ease';
      rightPokemonImg.style.transform = 'translateY(5%)';

      setTimeout(() => {
        rightPokemonImg.style.transform = 'translateY(0%)';
      }, 500);
    }
  }, 14000); // 13초 + 1초 + 1초

  // 11. 그 후 포켓몬들이 -10%로 이동 (2초동안)
  setTimeout(() => {
    if (leftPokemon) {
      leftPokemon.style.transition = 'transform 2s ease-out';
      leftPokemon.style.transform = 'translateX(-10%)';
    }
    if (rightPokemon) {
      rightPokemon.style.transition = 'transform 2s ease-in-out';
      rightPokemon.style.transform = 'translateX(20%)';
    }
  }, 15000); // 15초 + 1초

  // 12. 위에 움직임이 진행되면서 .intro-animation 자체가 서서히 사라짐 (3초동안)
  setTimeout(() => {
    if (leftPokemon) {
      leftPokemon.style.transition =
        'transform 2s cubic-bezier(.55,-0.32,.22,1)';
      leftPokemon.style.transform = 'translateX(-20%)';
    }
    if (rightPokemon) {
      rightPokemon.style.transition =
        'transform 1s cubic-bezier(.55,-0.32,.22,1)';
      rightPokemon.style.transform = 'translateX(-30%)';
    }
    if (introAnimation) {
      introAnimation.style.transition = 'opacity 2s ease-out';
      introAnimation.style.opacity = '0';
    }
  }, 19000); // 포켓몬 이동과 동시에 시작

  // 13-1. - 인트로 화면 종료
  setTimeout(() => {
    introAnimation.style.display = 'none';
  }, 21000);

  // 13-2. - 인트로 음악 종료
  setTimeout(() => {
    if (introMusicObj) {
      introMusicObj.pause();
      introMusicObj.currentTime = 0;
    }
  }, 21500);

  // 14. project-logo가 화면 밖에 있다가 2초동안 제자리로 돌아오는 애니메이션
  setTimeout(() => {
    if (projectLogo) {
      projectLogo.style.transition =
        'transform 1.5s cubic-bezier(.51,-0.21,.25,1.22)';
      projectLogo.style.transform = 'translateY(0)';
    }
    // home 음악 재생
    playHomeMusic();
  }, 21000); // intro-animation 사라진 후

  // 15. press-start, help, github-link가 순서대로 투명도 1 (트랜지션 없이, 0.5초 간격)
  setTimeout(() => {
    if (pressStart) pressStart.style.opacity = '1';
  }, 22500); // project-logo 애니메이션 완료 후

  setTimeout(() => {
    if (help) help.style.opacity = '1';
  }, 23000); // 0.5초 후

  setTimeout(() => {
    if (githubLink) githubLink.style.opacity = '1';
  }, 23500); // 0.5초 후

  // ballCanvas 투명도 1로 변경
  setTimeout(() => {
    if (ballCanvas) {
      ballCanvas.style.transition = 'opacity 0.3s ease';
      ballCanvas.style.opacity = '1';
    }
  }, 24000); // github-link 투명도 1이 된 후 0.5초 뒤
}

// DOM 로드 후 애니메이션 시작
document.addEventListener('DOMContentLoaded', () => {
  // 음악 초기화 (자동재생 안함)
  initHomeMusic();

  // 인트로 애니메이션 시작
  startIntroAnimation();
});
