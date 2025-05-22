import '../../common/total-time.ts'; // 누적 플레이 타임

import { allowMusic } from '../../common/music.ts';
// import homeMusicSrc from '/src/assets/music/home-music.mp3'; // 주석 처리 - 이제 home-animation.ts에서 관리
import selectMusicSrc from '/src/assets/music/intro-music.mp3';
import { userName } from '../../common/local-storage.ts';
import pokeBall from '../../assets/home/ball.png';

// home-music 오디오 객체 생성 및 음악 재생 - 자동재생 제거 (요구사항 6번)
const selectMusic = new Audio(selectMusicSrc);
// const homeMusic = new Audio(homeMusicSrc); // 주석 처리 - home-animation.ts에서 관리
// homeMusic.volume = 0.5; // 주석 처리
// allowMusic(homeMusic, true); // 주석 처리 - 자동재생 제거

// 마우스 올리고 내렸을 때 동작하는 함수
const pressStart = document.querySelector('.press-start') as HTMLElement;
const help = document.querySelector('.help') as HTMLElement;

pressStart.addEventListener('mouseenter', () => {
  allowMusic(selectMusic, false); // 효과음 1회
});

help.addEventListener('mouseenter', () => {
  allowMusic(selectMusic, false); // 효과음 1회
});

// 클릭 이벤트 - 로컬 스토리지에서 userName 있는지 확인 후 각자 페이지로 이동
pressStart.addEventListener('click', () => {
  if (userName() !== null && userName() !== '') {
    window.location.href = '/src/pages/town/town.html';
  } else {
    window.location.href = '/src/pages/start/start.html';
  }
});

// 캔버스에 포켓볼 돌아다니는 효과
// 캔버스 설정
const canvas = document.getElementById('ballCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 공 클래스 정의
class Ball {
  x: number; // X 좌표
  y: number; // Y 좌표
  radius: number; // 반지름
  dx: number; // X 방향 속도
  dy: number; // Y 방향 속도
  rotation: number; // 현재 회전 각도
  rotationSpeed: number; // 회전 속도
  image: HTMLImageElement; // 공 이미지

  constructor(
    x: number,
    y: number,
    radius: number,
    dx: number,
    dy: number,
    image: HTMLImageElement,
    rotationSpeed: number,
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = dx;
    this.dy = dy;
    this.rotation = 0;
    this.rotationSpeed = rotationSpeed;
    this.image = image;
  }

  // 공 그리기
  draw(): void {
    ctx.save();
    ctx.translate(this.x, this.y); // 중심 이동
    ctx.rotate(this.rotation); // 회전 적용
    ctx.drawImage(
      this.image,
      -this.radius,
      -this.radius,
      this.radius * 2,
      this.radius * 2,
    );
    ctx.restore();
  }

  // 매 프레임마다 호출되는 메서드
  update(balls: Ball[]): void {
    // 위치 업데이트
    this.x += this.dx;
    this.y += this.dy;

    // 회전 업데이트
    this.rotation += this.rotationSpeed;

    // 벽 충돌 처리
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    // 다른 공과 충돌 처리
    for (let other of balls) {
      if (this === other) continue; // 자기 자신 제외

      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDist = this.radius + other.radius;

      // 두 공이 겹칠 경우
      if (distance < minDist) {
        // 반사 방향 전환 (단순 물리 반응)
        this.dx = -this.dx;
        this.dy = -this.dy;
        other.dx = -other.dx;
        other.dy = -other.dy;

        // 겹침 해소를 위한 위치 조정
        const overlap = (minDist - distance) / 2;
        const offsetX = (dx / distance) * overlap;
        const offsetY = (dy / distance) * overlap;

        this.x += offsetX;
        this.y += offsetY;
        other.x -= offsetX;
        other.y -= offsetY;
      }
    }

    this.draw(); // 공 그리기
  }
}

// 공 이미지 생성
const ballImage = new Image();
ballImage.src = pokeBall; // 같은 경로에 ball.png 필요

const balls: Ball[] = []; // 공 배열
const numBalls: number = 10; // 생성할 공 수

// 이미지 로드 완료 시 실행
ballImage.onload = (): void => {
  for (let i = 0; i < numBalls; i++) {
    const radius: number = 40 + Math.random() * 30; // 40~70px 사이 크기
    let x: number, y: number, dx: number, dy: number;
    let overlapping: boolean = false;
    const rotationSpeed: number = (Math.random() - 0.5) * 0.05; // -0.025 ~ 0.025 회전 속도

    // 겹치지 않는 위치 찾기
    do {
      overlapping = false;
      x = Math.random() * (canvas.width - radius * 2) + radius;
      y = Math.random() * (canvas.height - radius * 2) + radius;
      dx = (Math.random() - 0.5) * 4; // 속도 -2 ~ 2
      dy = (Math.random() - 0.5) * 4;

      for (let j = 0; j < balls.length; j++) {
        const other = balls[j];
        const distX = x - other.x;
        const distY = y - other.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        if (distance < radius + other.radius) {
          overlapping = true;
          break;
        }
      }
    } while (overlapping);

    balls.push(new Ball(x, y, radius, dx, dy, ballImage, rotationSpeed));
  }

  // 애니메이션 시작
  animate();
};

// 모든 공을 갱신하고 다시 그리는 루프
function animate(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  balls.forEach(ball => ball.update(balls));
  requestAnimationFrame(animate);
}
