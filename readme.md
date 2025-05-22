# Pokémon Card Collection

## ➡️ [배포주소](https://pokemon-cc.netlify.app/)

```bash
https://pokemon-cc.netlify.app/
```

## 프로젝트 소개

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

### 프로젝트 목적

- JavaScript 학습 합니다.
- 추억의 포켓몬 게임을 경험 합니다.
- Gacha 와 Slot 미니 게임을 통해, 포켓몬 카드를 수집합니다.
- 수집한 포켓몬을 도감에서 확인하고, 그 외 포켓몬 타입별 분류하여 포켓몬 정보를 수집합니다.

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

### 주요기능 소개

- 사용자의 정보(이름) 및 플레이 정보(수집한 포켓몬) 을 로컬스토리지에 저장하여 관리합니다.
- Poke Api, Pokemon Card Api를 활용하여, 포켓몬 카드 및 도감번호, 이름 등 의 데이터를 불러옵니다.
- 자바스크립트 이벤트와 CSS를 활용하여 캐릭터 이동 및 3d형태를 구현합니다.
- 3js 를 활용하여 3d모델링을 구현합니다.
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
        <li>3js를 활용한 몬스터볼 모델링 기능</li>
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

# 도감부분 ui완료되면 잊지말고 도감부분 주요 기능 삽입하기.

## 제작 Team 소개

![팀로고](/public/readme/teamlogo.png)

- 404 Not Found 팀은 404에러 와 같이 빅 이슈에도 즐겁게 작업하자는 가치관을 지녔습니다.
- 부족한 부분은 서로 도우며, 각자의 장점을 살려 작업 및 역할 분배를 하였습니다.

<table width="1200" style="table-layout: fixed; border-collapse: collapse;">
  <!-- 이름 + GitHub 링크 (Row 1) -->
  <tr>
    <td align="center"><a href="https://github.com/ggungdev" target="_blank"><strong style="font-size: 18px;">한길</strong></a></td>
    <td align="center"><a href="https://github.com/charizard" target="_blank"><strong style="font-size: 18px;">리자몽</strong></a></td>
    <td align="center"><a href="https://github.com/pikachu" target="_blank"><strong style="font-size: 18px;">피카츄</strong></a></td>
    <td align="center"><a href="https://github.com/psyduck" target="_blank"><strong style="font-size: 18px;">고라파덕</strong></a></td>
  </tr>

  <!-- 이미지 (Row 2) -->
<tr>
  <td align="center" valign="top">
    <img src="/public/readme/hangil.png" width="600" style="border-radius: 10px; display: block;" />
  </td>
  <td align="center" valign="top">
    <img src="/public/readme/hangil.png" width="600" style="border-radius: 10px; display: block;" />
  </td>
  <td align="center" valign="top">
    <img src="/public/readme/hangil.png" width="600" style="border-radius: 10px; display: block;" />
  </td>
  <td align="center" valign="top">
    <img src="/public/readme/hangil.png" width="600" style="border-radius: 10px; display: block;" />
  </td>
</tr>

  <!-- 포지션 (Row 3) -->
  <tr>
    <td align="center"><div>프론트엔드 개발자 🧑‍💻</div></td>
    <td align="center"><div>디자이너 🎨</div></td>
    <td align="center"><div>백엔드 개발자 ⚙️</div></td>
    <td align="center"><div>기획자 📝</div></td>
  </tr>

  <!-- 특기 설명 (Row 4) -->
  <tr>
    <td align="left" style="font-size: 13px; padding-left: 16px;">
      <ul>
        <li>TypeScript 능숙</li>
        <li>UI/UX 감각 뛰어남</li>
        <li>코드리뷰 왕</li>
      </ul>
    </td>
    <td align="left" style="font-size: 13px; padding-left: 16px;">
      <ul>
        <li>감각적인 UI 제작</li>
        <li>피그마 마스터</li>
        <li>콘셉트 일관성 유지</li>
      </ul>
    </td>
    <td align="left" style="font-size: 13px; padding-left: 16px;">
      <ul>
        <li>API 설계 능숙</li>
        <li>DB 정규화 고수</li>
        <li>에러 핸들링 철저</li>
      </ul>
    </td>
    <td align="left" style="font-size: 13px; padding-left: 16px;">
      <ul>
        <li>플로우차트 설계</li>
        <li>요구사항 도출 명확</li>
        <li>일정관리 만렙</li>
      </ul>
    </td>
  </tr>
</table>
