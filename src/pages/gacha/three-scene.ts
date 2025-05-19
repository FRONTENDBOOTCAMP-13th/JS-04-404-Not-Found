// three-scene.ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { MeshStandardMaterial } from 'three';

let monsterBallScene: MonsterBallScene | null = null;

/// 씬 초기화 함수
function initScene() {
  // 이미 초기화된 경우 리셋
  if (monsterBallScene) {
    monsterBallScene.dispose();
    monsterBallScene = null;
  }

  try {
    // three-test는 클래스명으로 사용
    monsterBallScene = new MonsterBallScene('three-test');
    console.log('Three.js 씬 초기화 성공');
  } catch (error) {
    console.error('MonsterBallScene 초기화 오류:', error);

    // 실패한 경우 ID로 한번 더 시도
    try {
      monsterBallScene = new MonsterBallScene('three-scene');
      console.log('ID로 Three.js 씬 초기화 성공');
    } catch (secondError) {
      console.error('ID로도 초기화 실패:', secondError);
    }
  }
}

// 초기화 코드 수정 - DOMContentLoaded 및 커스텀 이벤트에 반응
document.addEventListener('DOMContentLoaded', () => {
  // three-scene 요소가 있는지 확인
  const threeSceneElement = document.getElementById('three-scene');
  if (threeSceneElement) {
    initScene();
  }
});

// three-test가 보여질 때 씬 초기화를 위한 커스텀 이벤트 리스너 수정
window.addEventListener('initThreeScene', (event: Event) => {
  console.log('initThreeScene 이벤트 감지');

  // CustomEvent의 detail 속성 사용을 위한 타입 캐스팅
  const customEvent = event as CustomEvent;
  const forceReinit = customEvent.detail?.forceReinit || false;

  // 강제 초기화 모드
  if (forceReinit) {
    console.log('강제 재초기화 요청 감지:', customEvent.detail?.timestamp);

    // 기존 씬 명시적 정리
    if (monsterBallScene) {
      monsterBallScene.dispose();
      monsterBallScene = null;
    }

    // 잠시 지연 후 초기화 (이전 리소스가 완전히 해제되도록)
    setTimeout(() => {
      initScene();
    }, 100);
  } else {
    // 일반 초기화
    initScene();
  }
});

// 씬 파괴 이벤트 리스너 추가
window.addEventListener('destroyThreeScene', () => {
  console.log('Three.js 씬 파괴 요청 감지');
  if (monsterBallScene) {
    monsterBallScene.dispose();
    monsterBallScene = null;
  }
});

class MonsterBallScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock: THREE.Clock;

  // 애니메이션 관련 변수
  private mixer: THREE.AnimationMixer | null = null;
  private model: THREE.Group | null = null;
  private isOpen: boolean = false;
  private isAnimating: boolean = false;
  private animations: {
    idle?: THREE.AnimationAction;
    open?: THREE.AnimationAction;
  } = {};

  // 상단 부분 식별을 위한 임계값
  private topThreshold: number = 0;

  // 상단 파트와 피벗 그룹 저장
  private topPart: THREE.Object3D | null = null;
  // private pivotGroup: THREE.Group | null = null;

  // 상단 파트의 원래 위치 저장 (애니메이션 후 복원용)
  private topPartOriginalPosition: THREE.Vector3 | null = null;
  // 오디오 관련 속성 수정
  private audio: HTMLAudioElement | null = null; // 효과음
  private bgmAudio: HTMLAudioElement | null = null; // 배경음악 추가

  constructor(containerId: string) {
    // 컨테이너 요소 찾기 - querySelector로 변경 (.은 클래스 선택자, #은 ID 선택자)
    const container =
      document.querySelector(`.${containerId}`) ||
      document.getElementById(containerId);
    if (!container) {
      throw new Error(`컨테이너 요소가 존재하지 않습니다: ${containerId}`);
    }
    this.container = container as HTMLElement;

    // 씬 설정
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);

    // 카메라 설정
    this.camera = new THREE.PerspectiveCamera(
      10, // 시야각(FOV) 조정
      this.container.clientWidth / this.container.clientHeight,
      0.1,
      1000,
    );
    // 카메라 위치 설정
    this.camera.position.set(0, 0, 5);
    // 카메라가 항상 씬의 중심을 바라보도록 설정
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 렌더러 설정
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 컨트롤 설정
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.target.set(0, 0, 0); // 컨트롤의 타겟을 씬의 중앙으로 설정

    // 클록 설정
    this.clock = new THREE.Clock();

    // 씬 초기화
    this.setupLights();
    this.loadModel();
    this.setupEventListeners();
    this.loadAudio();
    this.animate();
  }

  private setupLights(): void {
    // 환경광 추가
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // 방향광 추가
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  private loadModel(): void {
    // 로딩 매니저 생성
    const manager = new THREE.LoadingManager();

    // 로딩 진행 상황 표시를 위한 요소 생성
    const progressElement = document.createElement('div');
    progressElement.style.position = 'absolute';
    progressElement.style.top = '50%';
    progressElement.style.left = '50%';
    progressElement.style.transform = 'translate(-50%, -50%)';
    progressElement.style.padding = '10px';
    progressElement.style.background = 'rgba(0, 0, 0, 0.7)';
    progressElement.style.color = 'white';
    progressElement.style.borderRadius = '4px';
    progressElement.style.fontFamily = 'Arial, sans-serif';
    progressElement.style.fontSize = '14px';
    progressElement.style.zIndex = '1000';
    progressElement.textContent = '로딩 중... 0%';
    this.container.appendChild(progressElement);

    // 로딩 매니저 이벤트 설정
    manager.onProgress = (_url, loaded, total) => {
      const progress = Math.round((loaded / total) * 100);
      progressElement.textContent = `로딩 중... ${progress}%`;
    };

    manager.onLoad = () => {
      progressElement.style.display = 'none';
    };

    manager.onError = url => {
      progressElement.textContent = `로딩 오류: ${url}`;
      progressElement.style.background = 'rgba(255, 0, 0, 0.7)';
    };

    // GLTF 로더 생성
    const loader = new GLTFLoader(manager);

    // 모델 로드
    loader.load(
      '/models/gacha/scene.gltf', // public 폴더 내의 경로로 변경 필요
      gltf => {
        this.model = gltf.scene;
        this.scene.add(this.model);

        // 모델 크기 조정 (필요에 따라 조정)
        this.model.scale.set(1, 1, 1);

        // 모델 위치 조정 (필요에 따라 조정)
        this.model.position.set(0, 0, 0);

        // 그림자 설정
        this.model.traverse(node => {
          if ((node as THREE.Mesh).isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        // 모델 구조 로깅 (디버깅용)
        // this.logModelStructure();

        // 상단 파트 식별 및 피벗 그룹 설정
        this.setupTopPartWithPivot();

        // 애니메이션 믹서 설정
        this.setupAnimations(gltf);

        // 흔들림 애니메이션 시작
        this.startIdleAnimation();

        // 모델이 화면 크기에 맞게 자동 조정되도록 설정
        this.fitModelToContainer();
      },
      error => {
        console.error('모델 로드 오류:', error);
      },
    );
  }

  // 상단 파트를 식별하고 피벗 그룹 설정 (추가된 메서드)
  private setupTopPartWithPivot(): void {
    if (!this.model) return;

    // 모든 메시 객체 수집 및 y좌표 기준 정렬
    const allMeshes: THREE.Mesh[] = [];
    this.model.traverse(node => {
      if ((node as THREE.Mesh).isMesh) {
        allMeshes.push(node as THREE.Mesh);
      }
    });

    // y좌표 기준 내림차순 정렬
    allMeshes.sort((a, b) => {
      const boxA = new THREE.Box3().setFromObject(a);
      const boxB = new THREE.Box3().setFromObject(b);
      const centerA = boxA.getCenter(new THREE.Vector3());
      const centerB = boxB.getCenter(new THREE.Vector3());
      return centerB.y - centerA.y;
    });

    // y좌표가 가장 높은 객체를 상단 파트로 선택
    this.topPart = allMeshes.length > 0 ? allMeshes[0] : null;

    if (this.topPart) {
      console.log('상단 파트를 찾았습니다:', this.topPart.name);

      // 상단 파트의 원래 위치와 회전값 저장
      this.topPartOriginalPosition = this.topPart.position.clone();

      // 이 메서드에서는 피벗 그룹을 설정하지 않고 상단 파트 참조만 유지
      // 피벗 그룹은 애니메이션에서 필요 시 생성
    } else {
      console.warn('상단 파트를 찾지 못했습니다.');
    }
  }

  // 모델을 컨테이너 크기에 맞게 조정하는 메서드
  private fitModelToContainer(): void {
    if (!this.model) return;

    // 모델의 경계 상자 계산
    const boundingBox = new THREE.Box3().setFromObject(this.model);
    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());

    // 모델의 최대 크기
    const maxDim = Math.max(size.x, size.y, size.z);

    // 카메라 시야각(FOV)에 따른 적절한 거리 계산
    const fov = this.camera.fov * (Math.PI / 360);
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

    // 약간의 여백 추가
    cameraZ *= 1.2;

    // 카메라 위치 설정
    this.camera.position.z = cameraZ;

    // 카메라가 모델 중심을 바라보도록 설정
    this.controls.target.copy(center);
    this.camera.lookAt(center);
    this.controls.update();

    console.log('모델이 화면에 맞게 조정되었습니다.');
  }

  // 모델 내 모든 오브젝트 이름 출력 (디버깅용)
  // private logModelStructure(): void {
  //   if (!this.model) return;

  //   console.log('모델 구조:');

  //   // 모델의 경계 상자 계산
  //   const boundingBox = new THREE.Box3().setFromObject(this.model);
  //   const center = boundingBox.getCenter(new THREE.Vector3());
  //   const size = boundingBox.getSize(new THREE.Vector3());

  //   console.log('모델 중심점:', center);
  //   console.log('모델 크기:', size);

  //   // 상단/하단 구분을 위한 y 좌표 임계값
  //   this.topThreshold = center.y + size.y / 4;
  //   console.log('상단 구분 임계값:', this.topThreshold);

  //   // 모든 메시 객체 로깅 - 부모-자식 관계와 경로 정보 추가
  //   const logObject = (node: THREE.Object3D, depth = 0, path = '') => {
  //     const indent = '  '.repeat(depth);
  //     const newPath = path ? `${path}.${node.name}` : node.name;

  //     // 메시인 경우 추가 정보 기록
  //     if ((node as THREE.Mesh).isMesh) {
  //       const meshBoundingBox = new THREE.Box3().setFromObject(node);
  //       const meshCenter = meshBoundingBox.getCenter(new THREE.Vector3());
  //       const meshSize = meshBoundingBox.getSize(new THREE.Vector3());

  //       console.log(`${indent}${node.name} (${node.type}) - 경로: ${newPath}`);
  //       console.log(
  //         `${indent}  위치: (${meshCenter.x.toFixed(2)}, ${meshCenter.y.toFixed(2)}, ${meshCenter.z.toFixed(2)})`,
  //       );
  //       console.log(
  //         `${indent}  크기: (${meshSize.x.toFixed(2)}, ${meshSize.y.toFixed(2)}, ${meshSize.z.toFixed(2)})`,
  //       );
  //     } else {
  //       console.log(`${indent}${node.name} (${node.type}) - 경로: ${newPath}`);
  //     }

  //     // 자식 객체 순회
  //     node.children.forEach(child => {
  //       logObject(child, depth + 1, newPath);
  //     });
  //   };

  //   // 모델의 모든 객체 로깅 (계층 구조 포함)
  //   console.log('모델의 계층 구조:');
  //   logObject(this.model);

  //   // 모델 내 모든 메시 객체를 배열로 수집
  //   const allMeshes: THREE.Mesh[] = [];
  //   this.model.traverse(node => {
  //     if ((node as THREE.Mesh).isMesh) {
  //       allMeshes.push(node as THREE.Mesh);
  //     }
  //   });

  //   // 메시 객체들을 y 좌표 기준으로 정렬 (내림차순)
  //   allMeshes.sort((a, b) => {
  //     const boxA = new THREE.Box3().setFromObject(a);
  //     const boxB = new THREE.Box3().setFromObject(b);
  //     const centerA = boxA.getCenter(new THREE.Vector3());
  //     const centerB = boxB.getCenter(new THREE.Vector3());
  //     return centerB.y - centerA.y;
  //   });

  //   // 상위 3개 메시 객체 출력
  //   console.log('상단 후보 객체 (y좌표 기준):');
  //   for (let i = 0; i < Math.min(3, allMeshes.length); i++) {
  //     const mesh = allMeshes[i];
  //     const box = new THREE.Box3().setFromObject(mesh);
  //     const center = box.getCenter(new THREE.Vector3());
  //     console.log(`${i + 1}. ${mesh.name} - y좌표: ${center.y.toFixed(4)}`);
  //   }
  // }

  private setupAnimations(gltf: any): void {
    // GLTF에 포함된 애니메이션이 있는 경우 (만약 모델에 애니메이션이 있다면)
    if (gltf.animations && gltf.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.model!);

      // 애니메이션 클립 매핑
      gltf.animations.forEach((clip: THREE.AnimationClip) => {
        if (
          clip.name.toLowerCase().includes('idle') ||
          clip.name.toLowerCase().includes('shake')
        ) {
          this.animations.idle = this.mixer!.clipAction(clip);
        } else if (clip.name.toLowerCase().includes('open')) {
          this.animations.open = this.mixer!.clipAction(clip);
        }
      });

      console.log('애니메이션 로드됨:', Object.keys(this.animations));
    } else {
      // 모델에 애니메이션이 없는 경우 프로그래밍 방식으로 애니메이션 생성
      console.log(
        '모델에 애니메이션이 없습니다. 프로그래밍 방식으로 애니메이션을 생성합니다.',
      );
      this.createProgrammaticAnimations();
    }
  }

  private createProgrammaticAnimations(): void {
    if (!this.model) return;

    this.mixer = new THREE.AnimationMixer(this.model);

    // Y축 기준으로만 좌우 흔들림 애니메이션 (Idle)
    const idleTrackY = new THREE.NumberKeyframeTrack(
      '.rotation[y]', // y축 회전 (좌우 흔들림)
      [0, 0.5, 1, 1.5, 2], // 키프레임 시간
      [0, 0.1, 0, -0.1, 0], // 키프레임 값 (y축 회전)
    );

    // 단일 트랙을 포함한 애니메이션 클립 생성 (Y축만)
    const idleClip = new THREE.AnimationClip('idle', 2, [idleTrackY]);
    this.animations.idle = this.mixer.clipAction(idleClip);
    this.animations.idle.setLoop(THREE.LoopRepeat, Infinity);

    // 상단 파트가 있는 경우 열림 애니메이션 생성
    if (this.topPart) {
      console.log('상단 파트에 대한 복합 애니메이션 생성');

      // 상단 파트의 x축 회전 트랙 (뒤로 젖히기)
      const rotationTrack = new THREE.NumberKeyframeTrack(
        `${this.topPart.name}.rotation[x]`, // 로컬 회전
        [0, 0.5], // 키프레임 시간
        [0, -Math.PI / 6], // 키프레임 값 (x축으로 30도 회전)
      );

      // 상단 파트의 y축 위치 이동 트랙 (위로 올라가기 - 3배로 증가)
      const positionTrack = new THREE.NumberKeyframeTrack(
        `${this.topPart.name}.position[y]`, // 로컬 위치
        [0, 0.5], // 키프레임 시간
        [
          this.topPartOriginalPosition?.y || 0,
          (this.topPartOriginalPosition?.y || 0) + 1.3,
        ], // 위로 이동
      );

      // 상단 파트의 z축 위치 이동 트랙 (앞으로 이동하기) - 추가됨
      const positionTrackZ = new THREE.NumberKeyframeTrack(
        `${this.topPart.name}.position[z]`, // 로컬 위치의 z축
        [0, 0.5], // 키프레임 시간
        [
          this.topPartOriginalPosition?.z || 0,
          (this.topPartOriginalPosition?.z || 0) + 1.0,
        ], // 앞으로 1.0 단위 이동
      );

      // 여러 트랙을 포함한 애니메이션 클립 생성 (z축 트랙 추가)
      const openClip = new THREE.AnimationClip('open', 0.8, [
        rotationTrack,
        positionTrack,
        positionTrackZ,
      ]);
      this.animations.open = this.mixer.clipAction(openClip);
      this.animations.open.setLoop(THREE.LoopOnce, 1);
      this.animations.open.clampWhenFinished = true;
    }
  }

  private startIdleAnimation(): void {
    if (this.animations.idle) {
      this.animations.idle.reset().play();
    } else {
      // 흔들림 애니메이션이 없는 경우 수동으로 구현
      this.animateShake();
    }
  }

  private animateShake(): void {
    if (!this.model) return;

    // 수동 애니메이션 (애니메이션 시스템 없이 직접 회전)
    let time = 0;
    const animate = () => {
      if (!this.model || this.isAnimating) return;

      time += 0.02;
      // Y축 기준으로만 좌우 흔들림
      this.model.rotation.y = Math.sin(time * 3) * 0.1;

      requestAnimationFrame(animate);
    };

    animate();
  }

  private playOpenAnimation(): void {
    if (!this.model || this.isAnimating) return;

    this.isAnimating = true;

    // 배경음악 중지 // 주석: 배경음악 중지 코드 추가
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }

    // 효과음 재생
    if (this.audio) {
      // 이미 재생 중인 경우 처음부터 다시 재생
      this.audio.currentTime = 0;
      this.audio.play().catch(error => {
        console.warn('오디오 재생 오류:', error);
      });
    }

    if (this.animations.open) {
      // 흔들림 애니메이션 정지
      if (this.animations.idle) {
        this.animations.idle.stop();
      }

      // 열림 애니메이션 재생
      this.animations.open.reset().play();

      // 애니메이션 완료 후 상태 업데이트 (시간 조정)
      setTimeout(() => {
        this.isOpen = true;
        this.isAnimating = false;
      }, 800); // 애니메이션 길이에 맞게 조정
    } else {
      // 애니메이션이 없는 경우 수동으로 열기
      this.animateOpen();
    }
  }

  private animateOpen(): void {
    if (!this.model || !this.topPart) return;

    console.log('애니메이션 시작: 모델 열기 (복합 애니메이션)');

    // 애니메이션 시작
    const startTime = Date.now();
    const duration = 800;

    // 원래 상태 저장
    const startRotation = this.topPart.rotation.x;
    const startPosition = this.topPart.position.clone();

    // 타겟 값 설정
    const targetRotation = startRotation - Math.PI / 6; // 30도 뒤로 젖힘
    const targetPosition = new THREE.Vector3(
      startPosition.x,
      startPosition.y + 1.3, // y축으로 위로 이동
      startPosition.z + 1.0, // z축으로 앞으로 이동
    );

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 이징 함수 적용 (부드러운 애니메이션)
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease-out

      // 상단 파트의 회전 애니메이션
      this.topPart!.rotation.x =
        startRotation + (targetRotation - startRotation) * easeProgress;

      // 상단 파트의 위치 이동 애니메이션 (y축 및 z축)
      this.topPart!.position.y =
        startPosition.y + (targetPosition.y - startPosition.y) * easeProgress;
      this.topPart!.position.z =
        startPosition.z + (targetPosition.z - startPosition.z) * easeProgress; // z축 이동 추가

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isOpen = true;
        this.isAnimating = false;
        console.log('애니메이션 완료: 모델 열기');
      }
    };

    animate();
  }

  private setupEventListeners(): void {
    // 창 크기 변경 이벤트
    window.addEventListener('resize', this.handleResize);

    // 모델 클릭 이벤트
    this.renderer.domElement.addEventListener('click', this.handleClick);
  }

  private handleResize = (): void => {
    if (!this.container) return;

    // 카메라 업데이트
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();

    // 렌더러 업데이트
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight,
    );

    // 모델 크기 자동 조정 (추가)
    this.fitModelToContainer();
  };

  private handleClick = (event: MouseEvent): void => {
    // 이미 애니메이션 중이거나 열려있으면 무시
    if (this.isAnimating || this.isOpen) return;

    // 마우스 위치를 정규화된 장치 좌표(-1 ~ 1)로 변환
    const rect = this.renderer.domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 레이캐스팅을 위한 벡터 설정
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(x, y);

    // 레이캐스팅 수행
    raycaster.setFromCamera(mouse, this.camera);

    // 모델과의 교차점 확인
    if (this.model) {
      const intersects = raycaster.intersectObject(this.model, true);

      if (intersects.length > 0) {
        // 클릭된 객체 정보 로깅 (위치 확인용)
        const clickedPoint = intersects[0].point;
        console.log('클릭된 객체:', intersects[0].object.name);
        console.log('클릭 위치:', clickedPoint);

        // 모든 클릭에 대해 상단 파트 애니메이션 실행
        console.log('모델 클릭 감지 - 상단 파트 열기 실행');
        this.playOpenAnimation();
      }
    }
  };
  private loadAudio(): void {
    // 효과음 객체 생성
    this.audio = new Audio('/src/assets/music/dogamget.mp3');

    // 필요한 경우 오디오 속성 설정
    if (this.audio) {
      this.audio.volume = 0.4;
      this.audio.preload = 'auto';
    }

    // 배경음악 객체 생성 및 설정
    // 기존 재생 중인 오디오 검사 추가 // 주석: 기존 재생 중인 오디오 검사 추가
    const existingAudio = document.querySelector(
      '[data-bgm="three-bg"]',
    ) as HTMLAudioElement;

    if (existingAudio) {
      console.log('기존 재생 중인 Three.js 배경음악 발견, 재사용');
      this.bgmAudio = existingAudio;
    } else {
      this.bgmAudio = new Audio('/src/assets/music/three-bg.mp3');
      this.bgmAudio.volume = 0.3;
      this.bgmAudio.loop = true;
      this.bgmAudio.preload = 'auto';
      // 식별을 위한 데이터 속성 추가 // 주석: 식별용 데이터 속성 추가
      this.bgmAudio.setAttribute('data-bgm', 'three-bg');

      // 숨겨진 오디오 컨테이너에 추가하여 문서에서 관리 // 주석: 문서에 오디오 요소 추가
      const audioContainer =
        document.querySelector('.audio-container') || document.body;
      audioContainer.appendChild(this.bgmAudio);
    }

    // 재생 시점 관리 개선
    // 페이지 로드 시 현재 페이지가 Three.js 페이지인지 확인 후 배경음악 재생
    const threeSceneActive =
      document.getElementById('three-scene') !== null ||
      document.querySelector('.three-test') !== null;

    // 현재 표시 상태 확인 (display != none) // 주석: 표시 상태 확인 로직 추가
    const isVisible =
      threeSceneActive &&
      (document.getElementById('three-scene')?.offsetParent !== null ||
        (document.querySelector('.three-test') as HTMLElement)?.offsetParent !==
          null);

    // 가챠 페이지에서 오는지 확인
    const fromGachaEvent = sessionStorage.getItem('fromGachaEvent') === 'true';

    if (isVisible) {
      console.log('Three.js 페이지 활성화 상태 감지, 배경음악 준비');

      // 다른 배경음악 중지 (가챠 BGM 등) // 주석: 다른 배경음악 중지 로직 추가
      document.querySelectorAll('audio').forEach(el => {
        const audio = el as HTMLAudioElement;
        audio.play(); // 예시
      });

      // 배경음악이 재생 중이 아닌 경우에만 재생 시도
      if (this.bgmAudio && this.bgmAudio.paused) {
        this.playBackgroundMusic();
      }

      // 플래그 초기화
      if (fromGachaEvent) {
        sessionStorage.removeItem('fromGachaEvent');
      }
    }
  }

  // playBackgroundMusic 메서드 개선
  private playBackgroundMusic(): void {
    if (!this.bgmAudio) return;

    // 이미 재생 중인지 확인
    if (!this.bgmAudio.paused) {
      console.log('배경음악이 이미 재생 중입니다.');
      return;
    }

    console.log('배경음악 재생 시도...');

    // 사용자 상호작용 추적 변수 - 집게 이벤트 후에는 이미 상호작용이 있었다고 가정
    const hadUserInteraction =
      sessionStorage.getItem('fromGachaEvent') === 'true';

    // 재생 시도
    const playPromise = this.bgmAudio.play();

    // 프로미스 처리
    if (playPromise !== undefined) {
      playPromise
        .then(() => console.log('배경음악 재생 성공!'))
        .catch(error => {
          console.warn('배경음악 자동 재생 실패:', error);

          // 상호작용이 있었거나 집게 이벤트 후라면 다시 시도
          if (hadUserInteraction) {
            console.log('사용자 상호작용 이후, 배경음악 다시 시도');
            setTimeout(() => {
              this.bgmAudio?.play().catch(e => {
                console.error('두 번째 시도도 실패:', e);
                this.setupFallbackAudioPlay();
              });
            }, 500);
          } else {
            // 대체 재생 방법 설정
            this.setupFallbackAudioPlay();
          }
        });
    }
  }

  // 새로운 메서드: 대체 오디오 재생 설정
  private setupFallbackAudioPlay(): void {
    console.log('사용자 상호작용 후 음악 재생을 시도합니다.');

    // 이벤트 ID 관리를 위한 함수
    const handleInteraction = (e: Event) => {
      console.log('사용자 상호작용 감지:', e.type);

      // 모든 상호작용 이벤트 리스너 제거
      ['click', 'keydown', 'touchstart'].forEach(type => {
        document.removeEventListener(type, handleInteraction);
      });

      // 음악 재생 시도
      if (this.bgmAudio) {
        this.bgmAudio
          .play()
          .then(() => console.log('상호작용 후 배경음악 재생 성공!'))
          .catch(err => console.error('상호작용 후에도 재생 실패:', err));
      }
    };

    // 다양한 상호작용 이벤트에 리스너 추가
    ['click', 'keydown', 'touchstart'].forEach(type => {
      document.addEventListener(type, handleInteraction);
    });
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    // 델타 타임 계산
    const delta = this.clock.getDelta();

    // 애니메이션 믹서 업데이트
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // 컨트롤 업데이트
    this.controls.update();

    // 렌더링
    this.renderer.render(this.scene, this.camera);
  };

  // MonsterBallScene 클래스의 dispose 메서드 강화
  public dispose(): void {
    // 이벤트 리스너 해제
    window.removeEventListener('resize', this.handleResize);
    this.renderer.domElement.removeEventListener('click', this.handleClick);

    // 애니메이션 정지
    if (this.mixer) {
      this.mixer.stopAllAction();
    }

    // 오디오 정리 - 일시 정지만 하고 요소는 제거하지 않음 (재사용 가능하도록)
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }

    // 배경음악은 일시 정지만 하고 문서에서 제거하지 않음 // 주석: 배경음악 정리 수정
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      // DOM에서 제거하지 않고 참조만 해제
      this.bgmAudio = null;
    }

    // 모델 제거 및 메모리 해제
    if (this.model) {
      this.scene.remove(this.model);
      this.model.traverse(child => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) {
            mesh.geometry.dispose();
          }
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(material => {
                if (material instanceof MeshStandardMaterial && material.map) {
                  material.map.dispose();
                }
              });
            } else {
              if (
                mesh.material instanceof MeshStandardMaterial &&
                mesh.material.map
              ) {
                mesh.material.map.dispose();
              }
            }
          }
        }
      });
      this.model = null;
    }

    // 렌더러 해제
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.domElement.remove(); // 요소 자체 제거
    }

    // 씬 정리
    this.scene.clear();

    console.log('Three.js 씬 및 리소스 정리 완료');
  }
}

// 초기화 코드 - DOMContentLoaded 이벤트에 연결
// document.addEventListener('DOMContentLoaded', () => {
//   const monsterBallScene = new MonsterBallScene('three-scene');
// });
