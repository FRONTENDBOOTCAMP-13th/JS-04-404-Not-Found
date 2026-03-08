# Pokémon Card Collection

- [프로젝트 개요](#-프로젝트-소개)
- [팀소개](#-제작-team-소개)

## ➡️ [배포주소](https://pokemon-cc.netlify.app/)

## 기타 필요 정보 위키 주소

- ➡️ [프로젝트 기획](https://github.com/FRONTENDBOOTCAMP-13th/JS-04-404-Not-Found/wiki/Project-Info)
- ➡️ [개발관련 사항](https://github.com/FRONTENDBOOTCAMP-13th/JS-04-404-Not-Found/wiki/Development-Setup)
- ➡️ [그 외 관련정보](https://github.com/FRONTENDBOOTCAMP-13th/JS-04-404-Not-Found/wiki)

```bash
https://pokemon-cc.netlify.app/
```

## 🎮 프로젝트 소개

![팀로고](/public/readme/gamelogo.png)

### 저장소 받아보기

```cli
git clone https://github.com/FRONTENDBOOTCAMP-13th/JS-04-404-Not-Found.git
npm i
```

### 배포버전 미리보기

```cli
npm run build
npm run preview
```

### 개발버전 미리보기

```cli
npm run dev
```

### 🎯 프로젝트 목적

- JavaScript 학습 합니다.
- 추억의 포켓몬 게임을 경험 합니다.
- Gacha 와 Slot 미니 게임을 통해, 포켓몬 카드를 수집합니다.
- 수집한 포켓몬을 도감에서 확인하고, 그 외 포켓몬 타입별 분류하여 포켓몬 정보를 수집합니다.

### 개발 기간

- 프로젝트 시작일 : 2025-05-09
- 프로젝트 마감일 : 2025-05-22

### 프로젝트 환경

![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

### 사용 기술 스택

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)

## 🔀 프로젝트 전체 구조 흐름도

![유저플로우](/public/readme/userflow.jpg)

## 🕹️ 주요기능 소개

- 사용자의 정보(이름) 및 플레이 정보(수집한 포켓몬) 을 로컬스토리지에 저장하여 관리합니다.
- Poke Api, Pokemon Card Api를 활용하여, 포켓몬 카드 및 도감번호, 이름 등 의 데이터를 불러옵니다.
- 자바스크립트 이벤트와 CSS를 활용하여 캐릭터 이동 및 3d형태를 구현합니다.
- Three.js 를 활용하여 3d모델링을 구현합니다.
- 데이터 필터기능을 극대화 하여 모든 포켓몬을 타입별로 분류하여 정렬 합니다.
- 포켓몬 리스트와 로컬스토리지를 연동하여 소지한 포켓몬의 소지 유무 상태를 출력합니다.

### 기능 시연화면

<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game1.jpg" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>최초 접속 시, 배경음악 재생 여부를 선택</li>
        <li>OK은 음악재생, Cancel은 음소거로 진행</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game2.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>팀명 및 팀원의 캐릭터 역할 UI 표현</li>
        <li>Swiper를 활용한 슬라이드 기능 구현</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game10.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>게임 인트로 애니메이션 구현</li>
        <li>상단 스킵버튼으로 애니메이션 스킵 기능</li>
      </ul>
    </td>
  </tr>
</table>

<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game3.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>몬스터볼이 움직이는 애니메이션 구현</li>
        <li>버튼 마우스 hover에 따른 효과음 및 UI 변경</li>
      </ul>
    </td>
  </tr>
</table>

<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game4.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>화면 클릭시, 대화창의 대화 변경.</li>
        <li>유저의 이름 등록 및 로컬스토리지 저장</li>
        <li>유저 이름 미등록시, 다음 페이지로 이동불가(input value 조건 기능)</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game5.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>캐릭터 이동 모션 및 키보드 입력 이벤트</li>
        <li>캐릭터가 특정 영역에 충돌시, 팝업 및 페이지 이동기능</li>
        <li>로컬스토리지를 통해, 모달창 내용 업데이트 기능</li>
        <li>뒤로가기 및 음소거 버튼 기능</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game6.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>키보드 방향키 입력 이벤트로 집게 위치 이동 기능</li>
        <li>스페이스바 입력시, 집게가 내려가는 기능</li>
        <li>로컬스토리지를 통해, 모달창 내용 업데이트 기능</li>
        <li>모바일 반응형시, 게임보이 버튼과 집게 이동 연결 기능</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game7.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>Three.js를 활용한 몬스터볼 모델링 기능</li>
        <li>버튼 및 터치 이벤트시, 몬스터 볼이 몰리는 모션 기능</li>
        <li>랜덤으로 포켓몬 도감 번호 추출 및 카드 출력 기능</li>
        <li>모바일 반응형시, 게임보이 버튼과 집게 이동 연결 기능</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game8.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>도감 번호에 맞는 카드 API 호출 기능</li>
        <li>마우스 hover시 카드 입체감 및 하이라이트 기능</li>
        <li>포켓몬 API호출을 활용한 포켓몬 이름 및 도감 번호 출력 기능</li>
        <li>포켓몬 타입에 따른 배경 이미지 변경 기능</li>
        <li>추출한 포켓몬 도감 번호를 로컬스토리지에 저장하는 기능</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game9.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>랜덤으로 슬롯이 돌아가는 모션기능</li>
        <li>버튼 클릭 모션 기능</li>
        <li>24시간에 1번만 클릭 가능 기능</li>
        <li>그 외 상단 카드 뽑기 기능 및 모션 동일 함</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game12.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>Poke Api를 활용한 데이터 호출</li>
        <li>로컬 스토리지와 연동된, 획득/미획득 포켓몬 상태 표현 기능</li>
        <li>도감번호와 포켓몬 이름 등을 활용한 검색기능</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game11.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>포켓몬 타입별로 필터링 하여 체크 가능</li>
        <li>도감번호와 포켓몬 이름 등을 활용한 검색기능</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game14.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>획득한 포켓몬 카드를 도감에서 확인할 수 있는 기능</li>
        <li>미획득 포켓몬은 카드 출력이 되지 않습니다.</li>
      </ul>
    </td>
  </tr>
</table>

## 개발 비하인드

### 🧪 고난이도 기능 도전

<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <p>임한길</p>
    </td>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game5.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>배경에서 캐릭터가 돌아다니는 기능</li>
        <li>캐릭터가 건물에 닿았을때, 모달이나 해당 페이지로 이동하는 기능</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <p>길인환</p>
    </td>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game7.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>Three.js를 활용한 모델링 3d 모델링 기능</li>
        <li>모델링 이후 몬스터볼이 열리는 모션 기능</li>
        <li>그 외 클릭이벤트와 사운드 연결</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <p>송채은</p>
    </td>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game8.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>카드 3d 효과 기능</li>
        <li>포켓몬 카드 API를 비동기,프리로드로 이미지 로드</li>
        <li>레어 포켓몬 확률 조정 및 타입에 따른 배경, 레어도에 따른 배경 변경 기능</li>
      </ul>
    </td>
  </tr>
</table>
<table width = "100%">
  <tr>
    <td width="300" align="center" valign="middle">
      <p>박준환</p>
    </td>
    <td width="300" align="center" valign="middle">
      <img src="/public/readme/game13.webp" width="300" /><br />
    </td>
    <td width="800" valign="middle">
      <ul>
        <li>poke api 호출 및 데이터 로드</li>
        <li>api 데이터와 로컬스토리지 데이터를 연결한 필터링 기능</li>
        <li>로컬스토리지의 상태 구현 기능</li>
      </ul>
    </td>
  </tr>
</table>

### 🧪 트러블슈팅 사례

#### Town 캐릭터 충돌로 페이지 전환 에러

- 원인 : imageMapResize 라이브러리로 이미지맵이 리사이즈될 때 area 좌표가 실제 이미지와 달라져 충돌 판정이 불명확해짐.
- 해결 : area의 원본 좌표를 이미지의 현재 크기에 맞게 scale 변환하여, 캐릭터와 area의 충돌을 정확하게 계산하도록 수정

#### 3D 모델의 특정 메시 객체 위치 기반 감지

- 원인 : GLTF 모델에서 몬스터볼의 상단 부분이 어떤 메시 객체인지 자동으로 식별 불가
- 해결 : 모든 메시 객체의 경계 상자(Bounding Box)를 계산하여 y좌표가 가장 높은 객체를 상단 파트로 식별하는 로직을 구현

#### 카드이미지가 늦게 뜨는 이슈

- 원인 : Api 응답 지연 및 늦은 호출타이밍
- 해결 : 이미지를 프리로드하는 함수를 사용하여, 미리 이미지를 로드 받고, 호출 타이밍을 앞당김

#### 도감 필터링시, 데이터 조건 상태 구현 이슈

- 원인 : 전채포켓몬,획득한 포켓몬, 미획득한 포켓몬: 상태에 따라 어떤 데이터를 렌더링 해야할지 어려움을 겪음
- 해결 : 기존에 있던 '전체포켓몬 보기를' 제거하고, 기준을 항상 revealed(불린값) 상태로 단순화

#### 도감 페이지 진입시, Slot 배경음악 재생

- 원인 : 슬롯의 함수를 import 하며, 음악 재생 캐싱이 남아 잔류 배경음악이 재생됨.
- 해결 : 함수자체를 별개의 TS파일로 분리하여 해결

## 👪 제작 Team 소개

![팀로고](/public/readme/teamlogo.png)

- 404 Not Found 팀은 404에러 와 같이 빅 이슈에도 즐겁게 작업하자는 가치관을 지녔습니다.
- 부족한 부분은 서로 도우며, 각자의 장점을 살려 작업 및 역할 분배를 하였습니다.

### Team 구성원 소개

<table width="1200" style="table-layout: fixed; border-collapse: collapse;">
  <!-- 이름 + GitHub 링크 (Row 1) -->
  <tr>
    <td align="center"><a href="https://github.com/onewayay" target="_blank"><strong>임한길</strong></a></td>
    <td align="center"><a href="https://github.com/InHwanGil" target="_blank"><strong >길인환</strong></a></td>
    <td align="center"><a href="https://github.com/fipark" target="_blank"><strong>박준환</strong></a></td>
    <td align="center"><a href="https://github.com/chaeeun-nim" target="_blank"><strong >송채은</strong></a></td>
  </tr>

  <!-- 이미지 (Row 2) -->
<tr>
  <td align="center" valign="top" width="200">
    <img src="/public/readme/hangil.png"  width="800"/>
  </td>
  <td align="center" valign="top" width="200">
    <img src="/public/readme/inhwan.png"  width="800"/>
  </td>
  <td align="center" valign="top" width="200">
    <img src="/public/readme/junhwan.png"  width="800"/>
  </td>
  <td align="center" valign="top" width="200">
    <img src="/public/readme/chaeeun.png"  width="800"/>
  </td>
</tr>

  <!-- 포지션 (Row 3) -->
  <tr>
    <td align="center"><div>Team Leader / PM</div></td>
    <td align="center"><div>AD / Developer</div></td>
    <td align="center"><div>Scrum Master / PL</div></td>
    <td align="center"><div>CD / Developer</div></td>
  </tr>

  <!-- 특기 설명 (Row 4) -->
  <tr>
    <td align="left" style="font-size: 13px; padding-left: 16px;">
      <ul>
        <li>메타몽처럼 다재다능함</li>
        <li>사람을 따르게 만드는 능력</li>
        <li>한길의 말 한마디는 천냥 빚을 갚음</li>
      </ul>
    </td>
    <td align="left" style="font-size: 13px; padding-left: 16px;">
      <ul>
        <li>윈디처럼 카리스마 있음</li>
        <li>감각적이고 컨셉츄얼한 UI 제작</li>
        <li>보는사람이 감동받는 디자인 고수</li>
      </ul>
    </td>
    <td align="left" style="font-size: 13px; padding-left: 16px;">
      <ul>
        <li>모래두지 처럼 신중함</li>
        <li>API구조 분석 초고수</li>
        <li>데이터 필터링의 귀재</li>
      </ul>
    </td>
    <td align="left" style="font-size: 13px; padding-left: 16px;">
      <ul>
        <li>야돈처럼 생각이 많음</li>
        <li>놀라운 아이디어 제공</li>
        <li>빠른 업무처리! 귀여운 문서정리!</li>
      </ul>
    </td>
  </tr>
</table>

### [업무 분배](https://github.com/FRONTENDBOOTCAMP-13th/JS-04-404-Not-Found/wiki/Who-Did-What%3F)

- 상단 링크를 통해 위키를 참고하시면 더욱 자세한 내용을 확인 할 수 있습니다.

#### UI 구현

| **담당자** | **페이지** | **상세 설명**                        |
| ---------- | ---------- | ------------------------------------ |
| **임한길** | index      | 팀원 소개 및 프로젝트 시작 화면 구성 |
|            | home       | 게임 인트로 화면 UI                  |
|            | start      | 유저 이름 입력 화면 UI               |
| **송채은** | slot       | 포켓몬 슬롯 게임 화면 UI             |
|            | town       | 마을 및 게임 선택 화면 UI            |
| **길인환** | gacha      | 포켓몬 가챠 게임 화면 UI             |
| **박준환** | dictionary | 포켓몬 도감 UI                       |

#### 핵심 기능 구현

| **담당자** | **페이지** | **상세 설명**                                                              |
| ---------- | ---------- | -------------------------------------------------------------------------- |
| **임한길** | index      | Swiper를 활용한 팀원 소개 슬라이드 구현                                    |
|            | home       | 몬스터볼 움직임 애니메이션 구현                                            |
|            | start      | 유저 이름 입력 및 로컬스토리지 저장 기능                                   |
|            | town       | 로컬스토리지 기반 모달창 내용 업데이트 및 조건 달성 시 뱃지 상태 변경 기능 |
|            | 공통       | 음소거 및 뒤로가기 버튼 공통 기능 구현                                     |
| **송채은** | slot       | 포켓몬 슬롯 게임 구현                                                      |
|            |            | 카드 3D 회전 애니메이션 구현                                               |
|            |            | PokeAPI를 활용한 타입별 카드 배경 적용                                     |
|            |            | Pokémon TCG API를 활용한 카드 이미지 로드                                  |
|            |            | 포켓몬 도감 번호 랜덤 추출 및 레어 포켓몬 확률 조정 기능                   |
| **길인환** | gacha      | 포켓몬 가챠 미니게임 로직 구현                                             |
|            |            | Three.js를 활용한 몬스터볼 3D 모델링 구현                                  |
|            | home       | 게임 인트로 화면 애니메이션 구현                                           |
| **박준환** | dictionary | PokeAPI를 활용한 포켓몬 도감 구현                                          |
|            |            | 포켓몬 타입별 필터링 기능                                                  |
|            |            | 로컬스토리지 연동으로 소지 여부에 따른 도감 상태 표시 기능                 |

## 📚 출처 및 참고 자료

- Pokémon TCG API: https://pokemontcg.io
- PokeAPI: https://pokeapi.co
- 포켓몬 이미지 및 로고: Nintendo / GameFreak 소유

## 💑 Thanks to...

- 학습을 지원해주신 모든 멋쟁이사자 관련 임직원분들..♥️
- js부터 TypeScript 까지 꼼꼼히 가르쳐주신 용쌤♥️
- HTML과 CSS를 쉽게 알려주신 슬비쌤♥️

## 🦭 작성자의 프로젝트 후기...

게임 할 때는 그렇게 팀 운이 없더니, 현실에서는 팀운이 너무 좋습니다. <br>
이렇게 좋은 사람들을 만나 재밌는 프로젝트에 참여하게되어 영광입니다. <br>
지금처럼 좋은 기회가 찾아왔을때 당당하게 제몫을 하려면, 평소 공부를 꾸준히 해야함을 깨닳았습니다. <br>
(제몫을 안했다는건 아닙니다. 은근 이거저거 많이함!!!)<br>
공동 프로젝트임에도 다양한 개발 기능과 기타 업무와 발표까지 <br>
저를 믿고 많은 기회를 주신 팀원분들께 진심으로 감사드립니다.(진짜임) <br>
그리고 이 프로젝트를 무사히 끝마칠 수 있도록 도움주신 멋쟁이 사자 임직원분들과 <br>
깊은 관심과 애정으로 가르쳐주신 강사진분들께 다시한번 감사인사 드립니다. <br>
그럼 20000... <br>
