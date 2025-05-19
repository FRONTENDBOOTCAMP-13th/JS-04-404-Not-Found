
// music.ts 파일에서 함수 가져오기
import { allowMusic } from '../../common/music.ts';

// 오디오 객체 생성 및 변수 추가
let bgmAudio: HTMLAudioElement | null = null; // BGM 오디오 객체
let effectAudio: HTMLAudioElement | null = null; // 효과음 오디오 객체

// 오디오 초기화 함수
const initAudio = (): void => {
  // 음악 기능 활성화 (기본값으로 활성화)
  if (localStorage.getItem('musicPlay') === null) {
    localStorage.setItem('musicPlay', 'true');
  }

  // BGM 오디오 객체 생성
  bgmAudio = new Audio();
  bgmAudio.src = '/src/assets/music/gacha-bg.mp3'; // 실제 BGM 파일 경로로 변경 필요
  bgmAudio.volume = 0.5; // 볼륨 설정

  // 효과음 오디오 객체 생성
  effectAudio = new Audio();
  effectAudio.src = '/src/assets/music/claw-bgm.mp3'; // 실제 효과음 파일 경로로 변경 필요
  effectAudio.volume = 0.5; // 볼륨 설정

  // 페이지 로드 시 BGM 시작
  startBGM();
};

// Three-test 요소 선택 추가
const threeTest = document.querySelector('.three-test') as HTMLElement;
const popClose = document.querySelector('.pop-close') as HTMLElement;

// 기존 코드 상단에 추가 (이벤트 추가)
const initOrResetThreeScene = (): void => {
  if (threeTest) {
    // 기존 Canvas 요소 제거 (초기화 전에 정리)
    const existingCanvas = threeTest.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    // 전역 이벤트를 발생시켜 three-scene.ts에 초기화 신호 전달
    const event = new CustomEvent('initThreeScene', {
      detail: { forceReinit: true, timestamp: Date.now() },
    });
    window.dispatchEvent(event);

    // 콘솔에 로그 출력
    console.log('Three.js 씬 초기화 이벤트 발생 - 강제 재초기화');
  }
};

// BGM 시작 함수
const startBGM = (): void => {
  if (bgmAudio) {
    allowMusic(bgmAudio, true); // 반복 재생으로 설정
  }
};

// BGM 일시 정지 함수
const pauseBGM = (): void => {
  if (bgmAudio) {
    bgmAudio.pause();
  }
};

// 효과음 재생 함수
const playEffectSound = (): void => {
  if (effectAudio) {
    // 효과음 재생 전 처음으로 되돌림 (이미 재생 중인 경우 대비)
    effectAudio.currentTime = 0;
    allowMusic(effectAudio, false); // 반복 없이 한 번만 재생
  }
};

// 효과음 중지 함수
const stopEffectSound = (): void => {
  if (effectAudio) {
    effectAudio.pause();
    effectAudio.currentTime = 0;
  }
};

// 문서가 로드된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 오디오 초기화
  initAudio();

  // three-test 요소 스타일 확인 및 설정
  if (threeTest) {
    // 요소가 숨겨져 있는지 확인
    const displayStyle = window.getComputedStyle(threeTest).display;
    console.log('three-test 초기 표시 상태:', displayStyle);

    // 처음에는 숨기기
    threeTest.style.display = 'none';

    // three-test에 필요한 스타일 추가
    threeTest.style.position = 'fixed';
    threeTest.style.top = '0';
    threeTest.style.left = '0';
    threeTest.style.width = '100%';
    threeTest.style.height = '100%';
    threeTest.style.zIndex = '10000';
    threeTest.style.backgroundColor = 'black';
  }

  // 팝업 닫기 버튼에 이벤트 리스너 추가 (DOMContentLoaded 이벤트 내부)
  if (popClose) {
    popClose.addEventListener('click', () => {
      // 효과음 중지
      stopEffectSound();

      // three-test 숨기기
      if (threeTest) {
        threeTest.style.display = 'none';

        // Three.js 객체를 명시적으로 파괴하기 위한 이벤트 발생
        const event = new CustomEvent('destroyThreeScene');
        window.dispatchEvent(event);
        
      }

      // 0.5초 후에 배경음악 다시 시작
      setTimeout(() => {
        startBGM();
      }, 500);
    });
  }
});

// text-y 요소 선택 및 깜빡임 효과
const gachaTextY = document.querySelector('.gacha-text-y') as HTMLElement;
if (gachaTextY) {
  // 1초마다 실행되는 인터벌 설정
  setInterval(() => {
    // 불투명도를 1로 설정
    gachaTextY.style.opacity = '1';

    // 일정 시간 후 다시 불투명도를 0으로 되돌리기
    setTimeout(() => {
      gachaTextY.style.opacity = '0';
    }, 200); // 0.2초 후에 다시 불투명하게 변경
  }, 500); // 0.5초마다 반복
}

// text-y 요소 선택 및 깜빡임 효과
const helpText = document.querySelector('.help-text') as HTMLElement;
let helpTextInterval: number | null = null; // 인터벌 ID를 저장할 변수 추가
let userInteracted: boolean = false; // 사용자 상호작용 여부를 추적하는 변수 추가

if (helpText) {
  // 1초마다 실행되는 인터벌 설정
  helpTextInterval = window.setInterval(() => {
    // 사용자가 상호작용했으면 인터벌 중지 및 텍스트 숨김
    if (userInteracted) {
      if (helpTextInterval) {
        clearInterval(helpTextInterval);
        helpTextInterval = null;
      }
      helpText.style.display = 'none'; // 완전히 숨김
      return;
    }

    // 불투명도를 1로 설정
    helpText.style.opacity = '1';

    // 일정 시간 후 다시 불투명도를 0으로 되돌리기
    setTimeout(() => {
      helpText.style.opacity = '0';
    }, 500); // 0.5초 후에 다시 불투명하게 변경
  }, 1000); // 1초마다 반복
}

// help-text를 숨기는 함수
const hideHelpText = (): void => {
  // 첫 사용자 상호작용 시에만 실행
  if (!userInteracted && helpText) {
    userInteracted = true;

    // 인터벌 중지
    if (helpTextInterval) {
      clearInterval(helpTextInterval);
      helpTextInterval = null;
    }

    // 텍스트 요소 숨김
    helpText.style.display = 'none';
  }
};

// 필요한 요소들을 선택
const clawBox = document.querySelector('.claw-box') as HTMLElement;
const clawLine = document.querySelector('.claw-line') as HTMLElement;
const claw = document.querySelector('.claw') as HTMLElement;
const clawOpen = document.querySelector('.claw-open') as HTMLElement;
const clawBall = document.querySelector('.claw-ball') as HTMLElement;

// 모바일 조작 요소 선택 추가
const joystickLeft = document.querySelector('.joystick-left') as HTMLElement;
const joystickRight = document.querySelector('.joystick-right') as HTMLElement;
const aButton = document.querySelector('.a-button') as HTMLElement;

// 부모 요소의 너비를 기준으로 최대 이동 거리 계산 (부모 너비의 35%)
const parentElement = clawBox.parentElement as HTMLElement;
const getMaxMoveDistance = (): number => {
  if (parentElement) {
    // 스크롤바 문제를 방지하기 위해 부모 요소의 clientWidth 사용 (스크롤바 제외 너비)
    return parentElement.clientWidth * 0.35;
  }
  return 300; // 기본값
};

// 초기 위치 설정 (화면 중앙)
let currentPosition: number = 0;
let maxMoveDistance: number = getMaxMoveDistance(); // 최대 이동 거리를 동적으로 계산

// 모바일 화면 여부 확인 변수 추가
let isMobileView: boolean = window.innerWidth <= 640;

// 동작 상태 추적 변수 (스페이스바 액션 중인지)
let isGrabbing: boolean = false;
// 동작 단계 추적 변수 (0: 시작 안함, 1: 내려가는 중, 2: 줄 최대 내려감, 3: 올라가는 중, 4: 완료)
// let grabStage: number = 0;
// 동작 시작 시간 (리사이즈 시 동작 상태 유지에 사용)
// let grabStartTime: number = 0;

// 키보드 눌림 상태 추적을 위한 객체
const keyState: { [key: string]: boolean } = {
  ArrowLeft: false,
  ArrowRight: false,
};

// clawBox에 트랜지션 적용 (브라우저 크기 변경시에만 사용)
let isResizing: boolean = false;

// 동작 타이머 ID 저장 - 창 크기 조절시 타이머 초기화용
let grabTimers: number[] = [];

// 화면 크기에 따른 조작 방식 업데이트 함수
const updateControlMethod = (): void => {
  isMobileView = window.innerWidth <= 640;
};

// 모바일 컨트롤러 요소 초기 설정
const updateMobileControlsVisibility = (): void => {
  // 모바일 화면 여부 확인
  const isMobile = window.innerWidth <= 640;

  // 모바일 컨트롤러 요소 표시/숨김 설정
  if (joystickLeft) joystickLeft.style.display = isMobile ? 'block' : 'none';
  if (joystickRight) joystickRight.style.display = isMobile ? 'block' : 'none';
  if (aButton) aButton.style.display = isMobile ? 'block' : 'none';
};

// 초기 컨트롤러 표시 상태 설정
updateMobileControlsVisibility();

// 윈도우 크기 변경 이벤트에 컨트롤러 표시 업데이트 추가
window.addEventListener('resize', () => {
  // 기존 코드 유지...
  isResizing = true;

  // 위치 조정 로직 유지...
  if (isGrabbing) {
    adjustPositionKeepingGrabAction();
  } else {
    adjustPositionKeepingGrabAction();
  }

  // 리사이징 완료 표시
  isResizing = false;

  // 조작 방식 업데이트
  updateControlMethod();

  // 모바일 컨트롤러 표시 상태 업데이트 추가
  updateMobileControlsVisibility();
});

// 모든 타이머 초기화 및 상태 완전 리셋 함수 - 브라우저 창 초기화 등에 사용
const resetAllTimersAndState = (): void => {
  // 모든 타이머 초기화
  grabTimers.forEach(timer => clearTimeout(timer));
  grabTimers = [];

  // 상태 및 요소 초기화
  isGrabbing = false;
  grabStage = 0;
  clawBox.classList.remove('grabbing');

  // 요소 초기 상태로 복원
  claw.style.opacity = '1';
  clawOpen.style.opacity = '0';
  if (clawBall) {
    clawBall.style.opacity = '0';
  }

  // 집게 줄 초기 상태로 복원
  clawLine.style.transition = 'height 0.5s ease-in-out';
  clawLine.style.height = '5%';

  // 콘솔 확인
  console.log('갔냐?');
};

// 현재 진행 중인 동작을 유지하면서 위치만 조정하는 함수
const adjustPositionKeepingGrabAction = (): void => {
  // 기존 위치를 백분율로 계산 (현재 위치 / 최대 이동 거리)
  const positionRatio =
    maxMoveDistance !== 0 ? currentPosition / maxMoveDistance : 0;

  // 최대 이동 거리 재계산
  maxMoveDistance = getMaxMoveDistance();

  // 새로운 위치 계산 (비율 유지)
  currentPosition = positionRatio * maxMoveDistance;

  // 현재 위치 업데이트 (트랜지션 없이)
  clawBox.style.transition = 'none';
  clawBox.style.transform = `translateX(${currentPosition}px)`;

  // 리사이징 완료 후 트랜지션 복원 (다음 프레임에서)
  requestAnimationFrame(() => {
    clawBox.style.transition = 'transform 0.3s ease-out';
  });
};

// 키보드 keydown 이벤트 처리
document.addEventListener('keydown', (event: KeyboardEvent) => {
  // 첫 키보드 입력 시 help-text 숨김
  hideHelpText();

  // 집기 동작 중이면 키보드 이벤트 무시
  if (isGrabbing) return;

  // 모바일 화면일 경우 키보드 입력 무시
  if (isMobileView) return;

  // 좌우 방향키 눌림 상태 저장
  if (event.key === 'ArrowLeft') {
    keyState.ArrowLeft = true;
  } else if (event.key === 'ArrowRight') {
    keyState.ArrowRight = true;
  } else if (event.key === ' ') {
    // 스페이스바 처리 (집기 동작)
    // 이미 동작 중이거나 집기 동작 중이면 무시
    if (!isGrabbing && !clawBox.classList.contains('grabbing')) {
      grabAction();
    }
  }
});

// 키보드 keyup 이벤트 처리
document.addEventListener('keyup', (event: KeyboardEvent) => {
  // 모바일 화면일 경우 키보드 입력 무시
  if (isMobileView) return;

  // 좌우 방향키 눌림 상태 해제
  if (event.key === 'ArrowLeft') {
    keyState.ArrowLeft = false;
  } else if (event.key === 'ArrowRight') {
    keyState.ArrowRight = false;
  }
});

// 모바일 조작 이벤트 추가 - 터치 이벤트
joystickLeft.addEventListener('touchstart', () => {
  // help-text 숨김
  hideHelpText();
  if (isMobileView) {
    keyState.ArrowLeft = true;
  }
});

joystickRight.addEventListener('touchstart', () => {
  // help-text 숨김
  hideHelpText();
  if (isMobileView) {
    keyState.ArrowRight = true;
  }
});

// 마우스 클릭 이벤트에도 help-text 숨김 로직 추가
joystickLeft.addEventListener('touchend', () => {
  // help-text 숨김
  hideHelpText();
  if (isMobileView) {
    keyState.ArrowLeft = false;
  }
});

joystickRight.addEventListener('touchend', () => {
  // help-text 숨김
  hideHelpText();
  if (isMobileView) {
    keyState.ArrowRight = false;
  }
});

// 모바일 A 버튼 이벤트 추가
aButton.addEventListener('touchstart', () => {
  // help-text 숨김
  hideHelpText();
  if (isMobileView && !isGrabbing && !clawBox.classList.contains('grabbing')) {
    grabAction();
  }
});

// 모바일 터치 이벤트 취소 함수 (터치 시 화면 스크롤 방지)
const preventDefaultTouch = (event: TouchEvent): void => {
  event.preventDefault();
};

// 모바일 조작 요소에 터치 이벤트 취소 추가
joystickLeft.addEventListener('touchmove', preventDefaultTouch);
joystickRight.addEventListener('touchmove', preventDefaultTouch);
aButton.addEventListener('touchmove', preventDefaultTouch);

// 모바일 클릭 이벤트 추가 (터치 외에도 마우스 클릭으로 조작 가능하도록)
joystickLeft.addEventListener('mousedown', () => {
  // help-text 숨김
  hideHelpText();
  if (isMobileView) {
    keyState.ArrowLeft = true;
  }
});

joystickRight.addEventListener('mousedown', () => {
  // help-text 숨김
  hideHelpText();
  if (isMobileView) {
    keyState.ArrowRight = true;
  }
});

// 모바일 클릭 이벤트 해제
joystickLeft.addEventListener('mouseup', () => {
  if (isMobileView) {
    keyState.ArrowLeft = false;
  }
});

joystickRight.addEventListener('mouseup', () => {
  if (isMobileView) {
    keyState.ArrowRight = false;
  }
});

joystickLeft.addEventListener('mouseleave', () => {
  if (isMobileView) {
    keyState.ArrowLeft = false;
  }
});

joystickRight.addEventListener('mouseleave', () => {
  if (isMobileView) {
    keyState.ArrowRight = false;
  }
});

// A 버튼 클릭 이벤트
aButton.addEventListener('click', () => {
  // help-text 숨김
  hideHelpText();
  if (isMobileView && !isGrabbing && !clawBox.classList.contains('grabbing')) {
    grabAction();
  }
});

// 키 상태에 따라 지속적으로 이동시키기 위한 애니메이션 프레임
function moveClawBox(): void {
  // 현재 최대 이동 거리 갱신
  if (!isResizing) {
    maxMoveDistance = getMaxMoveDistance();
  }

  // 집기 동작 중이 아닐 때만 이동 가능
  if (!isGrabbing) {
    if (keyState.ArrowLeft && currentPosition > -maxMoveDistance) {
      currentPosition -= 5; // 이동 속도 조절
      clawBox.style.transform = `translateX(${currentPosition}px)`;
    }

    if (keyState.ArrowRight && currentPosition < maxMoveDistance) {
      currentPosition += 5; // 이동 속도 조절
      clawBox.style.transform = `translateX(${currentPosition}px)`;
    }
  }

  // 다음 프레임에서도 계속 실행
  requestAnimationFrame(moveClawBox);
}

// 애니메이션 시작
requestAnimationFrame(moveClawBox);

// 집기 동작 함수 수정 - 1초 지연 추가
const grabAction = (): void => {
  // 모든 타이머 초기화
  grabTimers.forEach(timer => clearTimeout(timer));
  grabTimers = [];

  // BGM 일시 정지 및 효과음 재생
  pauseBGM();
  playEffectSound();

  // 동작 시작 시간 기록
  grabStartTime = performance.now();

  // 동작 중임을 표시
  isGrabbing = true;
  grabStage = 1; // 내려가는 중
  clawBox.classList.add('grabbing');

  // 1. 집게 상태 변경 (닫힌 상태 -> 열린 상태)
  claw.style.opacity = '0';
  clawOpen.style.opacity = '1';

  // 2. 집게 줄 내리기 (2초간 애니메이션)
  clawLine.style.transition = 'height 2s ease-in-out';
  clawLine.style.height = '45%';

  // 3. 줄이 다 내려간 후 처리
  const timer1 = window.setTimeout(() => {
    grabStage = 2; // 줄 최대 내려감
    clawBall.style.opacity = '1';

    // 4. 0.5초 후 다시 올리기
    const timer2 = window.setTimeout(() => {
      grabStage = 3; // 올라가는 중
      // 줄 올리기
      clawLine.style.transition = 'height 1.5s ease-in-out';
      clawLine.style.height = '5%';

      // 줄이 완전히 올라간 후 초기화
      const timer3 = window.setTimeout(() => {
        grabStage = 4; // 완료
        // 집게 닫기
        claw.style.opacity = '1';
        clawOpen.style.opacity = '0';

        // claw-ball 숨기기
        if (clawBall) {
          clawBall.style.opacity = '0';
        }

        // 동작 중 표시 해제
        clawBox.classList.remove('grabbing');
        isGrabbing = false;

        // 효과음 중지
        stopEffectSound();

        // 기존 grabAction 함수 마지막 부분 수정
        // 1초 지연 후 three-test 화면 활성화 및 초기화 (수정된 부분)
        setTimeout(() => {
          if (threeTest) {
            // three-test 표시 전에 현재 배경음악 중지
            if (bgmAudio) {
              bgmAudio.pause();
            }

            // 다음 페이지로 플래그 전달
            sessionStorage.setItem('fromGachaEvent', 'true');

            // 화면 표시
            threeTest.style.display = 'block';

            // 약간의 지연 후 Three.js 초기화 (DOM이 업데이트된 후)
            setTimeout(() => {
              initOrResetThreeScene();
            }, 50);
          }
        }, 1000); // 1초 지연 유지

        // 타이머 배열에서 제거
        grabTimers = grabTimers.filter(
          t => t !== timer1 && t !== timer2 && t !== timer3,
        );
      }, 2000);

      grabTimers.push(timer3);
    }, 500);

    grabTimers.push(timer2);
  }, 2000);

  grabTimers.push(timer1);
};

// focus 이벤트에도 BGM 재시작 코드 추가
window.addEventListener('focus', () => {
  // 윈도우 포커스가 돌아오면 진행 중인 동작이 있는지 확인하고 없으면 초기화
  if (!isGrabbing) {
    resetAllTimersAndState();
    // 페이지가 다시 활성화되면 BGM 재시작
    startBGM();
  }
});

// 문서가 보이지 않게 될 때 상태 확인 (수정)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 작업이 진행 중이 아닐 때만 초기화
    if (!isGrabbing) {
      resetAllTimersAndState();
      // 페이지가 숨겨질 때 BGM 일시 정지
      pauseBGM();
    }
  } else {
    // 페이지가 다시 보이게 되면 BGM 재시작 (진행중이 아닐 때만)
    if (!isGrabbing) {
      startBGM();
    }
  }
});

// 전체 문서 클릭 이벤트 추가 - 컨트롤러 외 영역 클릭 시에도 help-text 숨김
document.addEventListener('click', () => {
  hideHelpText();
});
