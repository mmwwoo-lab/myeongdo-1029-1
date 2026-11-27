/**
 * 명도 이명우의 바이브 코딩연구소 - 데이터 저장소
 * Vibe Coding Lab by Myeongdo Lee Myung-woo
 */

export const siteConfig = {
  title: "명도 이명우의 바이브 코딩연구소",
  subtitle: "MYEONGDO · VIBE CODING & AI APP LAB",
  slogan: "말 한마디로 기획부터 완성까지, AI 바이브 코딩으로 실전 앱을 만듭니다.",
  author: "이명우 (명도)",
  role: "AI 바이브 코더 & 크리에이터",
  status: "연구소 가동 중 (온라인)",
  contact: {
    email: "myeongdo@gmail.com",
    kakao: "https://open.kakao.com/o/gwNRB7rh",
    github: "https://github.com",
    youtube: "https://www.youtube.com",
    instagram: "https://www.instagram.com"
  }
};

export const newsList = [
  {
    badge: "모집 중",
    badgeType: "rose",
    title: "코딩 몰라도 3시간 만에 내 서비스 런칭: 바이브 코딩 실전 챌린지 1기",
    desc: "기획, 프롬프트, UI 구현, 무료 호스팅 배포까지 한번에 마스터하는 집중 워크숍",
    link: "https://open.kakao.com/o/gwNRB7rh"
  },
  {
    badge: "집필 중",
    badgeType: "sun",
    title: "『누구나 따라하는 AI 바이브 코딩과 앱개발 레시피』 도서 출간 준비 중",
    desc: "현직 디자이너·기획자·비개발자를 위한 가장 쉬운 AI 코딩 가이드북",
    link: "#"
  },
  {
    badge: "NEW 출시",
    badgeType: "leaf",
    title: "명도 AI 앱 템플릿 & 프롬프트 라이브러리 v2.0 공개",
    desc: "복사해서 바로 쓰는 검증된 AI 스킬 및 시스템 프롬프트 50선 무료 배포",
    link: "#panel-skills"
  }
];

export const communityLinks = [
  {
    id: "kakao-main",
    title: "바이브 코딩 연구소 오픈채팅",
    desc: "질문, 프롬프트 나눔, 실시간 앱 피드백",
    badge: "❖ 메인 커뮤니티",
    color: "leaf",
    wide: true,
    link: "https://open.kakao.com/o/gwNRB7rh"
  },
  {
    id: "info-room",
    title: "AI 신기술 & 트렌드 정보방",
    desc: "최신 AI 모델, 툴, 오픈소스 업데이트",
    badge: "정보방",
    color: "grape",
    wide: false,
    link: "https://open.kakao.com/o/gGiRtK5h"
  },
  {
    id: "portfolio",
    title: "연구소 제작 앱 갤러리",
    desc: "바이브 코딩으로 완성한 포트폴리오",
    badge: "포트폴리오",
    color: "sky",
    wide: false,
    link: "#panel-makes"
  },
  {
    id: "youtube",
    title: "바이브코딩 유튜브 채널",
    desc: "한 편으로 끝내는 AI 앱 만들기 영상",
    badge: "유튜브",
    color: "rose",
    wide: false,
    link: "https://www.youtube.com"
  },
  {
    id: "inquiry",
    title: "협업 · 강연 · 외주 문의",
    desc: "오픈채팅 1:1 상담 및 기업 교육",
    badge: "문의하기",
    color: "tang",
    wide: false,
    link: "https://open.kakao.com/o/sLT5HQMe"
  }
];

export const tipsData = [
  {
    id: "tip8",
    layer: "Layer 08",
    isNew: true,
    category: "바이브코딩",
    color: "leaf",
    title: "동물의 숲 컴퍼니: 7마리 AI 직원에게 일 시키기",
    desc: "동물 캐릭터 직원들에게 기획, 코딩, 디자인을 맡기고 말풍선으로 인터랙티브하게 업무를 진행하는 에이전트 시스템 구축법.",
    readTime: "5분 소요",
    tags: ["에이전트", "바이브코딩", "재미요소"],
    link: "https://ionized-flyaway-38e.notion.site/4201a72665eb81c38a8ce4a6699d5d96?source=copy_link",
    summary: "Claude와 GPT를 활용해 멀티 에이전트 롤플레잉 UI를 브라우저 위에 손쉽게 구성하는 노하우를 정리했습니다."
  },
  {
    id: "tip7",
    layer: "Layer 07",
    isNew: true,
    category: "바이브코딩",
    color: "leaf",
    title: "초보자를 위한 3D 가상 온라인 전시관 만들기",
    desc: "복잡한 3D 엔진 설치 없이 Three.js와 AI 대화만으로 내 작품과 포트폴리오를 전시할 메타버스 갤러리를 완성합니다.",
    readTime: "7분 소요",
    tags: ["Three.js", "웹3D", "전시관"],
    link: "https://ionized-flyaway-38e.notion.site/40b1a72665eb810791d3c3b88710453f",
    summary: "텍스처 로딩부터 1인칭 조작 카메라, 액자 인터랙션까지 한 줄씩 구현해가는 바이브 코딩 프로세스입니다."
  },
  {
    id: "tip6",
    layer: "Layer 06",
    isNew: false,
    category: "영상/VFX",
    color: "tang",
    title: "영상 속 동작 그대로! 인물·배경 교체 및 VFX 모션",
    desc: "원작 영상의 자연스러운 포즈와 리듬을 살리면서 캐릭터와 배경을 바꾸고 화려한 VFX 모션을 결합하는 워크플로우.",
    readTime: "6분 소요",
    tags: ["영상AI", "모션제어", "VFX"],
    link: "https://ionized-flyaway-38e.notion.site/VFX-3fc1a72665eb81be96d6d4249f4f8d24",
    summary: "ControlNet 및 최신 비디오 생성 AI를 결합해 뮤직비디오급 연출을 손쉽게 구현하는 팁입니다."
  },
  {
    id: "tip5",
    layer: "Layer 05",
    isNew: false,
    category: "영상/VFX",
    color: "tang",
    title: "GPT ASTRA로 에펙 없이 모션그래픽 자동 생성하기",
    desc: "어려운 애프터이펙트 키프레임 대신 자연어 프롬프트로 다이내믹한 모션그래픽 코드를 생성하고 재사용 가능한 스킬로 저장합니다.",
    readTime: "4분 소요",
    tags: ["모션그래픽", "ASTRA", "자동화"],
    link: "https://ionized-flyaway-38e.notion.site/GPT-ASTRA-3d51a72665eb81adab2ed6730cf6a2d5",
    summary: "SVG 애니메이션 및 CSS Canvas 애니메이션을 말로 지시하고 미세 조정하는 실전 팁입니다."
  },
  {
    id: "tip4",
    layer: "Layer 04",
    isNew: false,
    category: "이미지/디자인",
    color: "sky",
    title: "AI 이미지 생성 시 내가 원하는 한글 폰트 완벽 적용법",
    desc: "AI가 자주 뭉개버리는 한글 텍스트를 원하는 폰트 스타일 그대로 선명하게 디자인에 녹여내는 레이어 합성 노하우.",
    readTime: "4분 소요",
    tags: ["한글폰트", "이미지합성", "타이포"],
    link: "https://ionized-flyaway-38e.notion.site/AI-3c01a72665eb81dba54bc68ee36a30a2",
    summary: "폰트 견본 생성기 + 알파 채널 마스크를 활용해 AI 이미지와 서체를 매끄럽게 블렌딩하는 기법입니다."
  },
  {
    id: "tip3",
    layer: "Layer 03",
    isNew: false,
    category: "영상/VFX",
    color: "tang",
    title: "머릿속 상상을 영상으로: 아이디어에서 유튜브까지 5단계",
    desc: "스토리 기획 → 콘티/스토리보드 생성 → 음성 합성 → 숏폼 영상 렌더링까지 반나절 만에 완성하는 파이프라인.",
    readTime: "8분 소요",
    tags: ["스토리보드", "숏폼", "파이프라인"],
    link: "https://ionized-flyaway-38e.notion.site/3b31a72665eb8184be99ee0b2114ea69",
    summary: "기획이 막막할 때 챗GPT로 스토리 구조를 짜고 영상 생성 툴로 빠르게 시각화하는 전체 공정입니다."
  },
  {
    id: "tip2",
    layer: "Layer 02",
    isNew: false,
    category: "이미지/디자인",
    color: "grape",
    title: "AI 제작 그래픽, 실제 인쇄(출력)까지 실패 없이 넘기기",
    desc: "모니터 RGB와 다른 CMYK 색상 차이, 300DPI 고해상도 업스케일링, 재단선 여백 설정까지 인쇄 사고 방지 체크리스트.",
    readTime: "5분 소요",
    tags: ["인쇄출력", "CMYK", "해상도업스케일"],
    link: "https://ionized-flyaway-38e.notion.site/AI-7201a72665eb83c78c3101ef604f6088",
    summary: "굿즈, 포스터, 명함 제작 시 AI 이미지를 상업용 인쇄 품질로 다듬는 무료 툴 사용법을 안내합니다."
  },
  {
    id: "tip1",
    layer: "Layer 01",
    isNew: false,
    category: "이미지/디자인",
    color: "grape",
    title: "바이브 코더 & 크리에이터 필수 AI 사이트 총정리 맵",
    desc: "이미지, 영상, 음성, 코드 생성, 자동 배포까지 명도 연구소에서 매일 직접 검증하고 쓰는 핵심 도구 모음집.",
    readTime: "10분 소요",
    tags: ["필수도구", "북마크", "치트시트"],
    link: "https://ionized-flyaway-38e.notion.site/AI-2c71a72665eb807b902afb7b118c94eb",
    summary: "수많은 AI 서비스 중 돈 낭비 없이 무료 플랜으로도 최대의 효과를 내는 알짜 도구들만 엄선했습니다."
  }
];

export const skillsData = [
  {
    id: "skill6",
    layer: "Layer 06",
    isNew: true,
    category: "AI 스킬",
    color: "sun",
    title: "예능 자막 하이라이트 자동 추출 스킬",
    desc: "영상 스크립트나 클립 목록을 분석해 재미있는 하이라이트 구간을 찾고, 톡톡 튀는 방송 예능 스타일 자막 코드를 생성합니다.",
    repoUrl: "https://github.com/ssaengcho01/ssaengcho/tree/main/variety-captions",
    promptPreview: "이 영상 대본을 보고 예능 하이라이트 3구간과 감탄사/효과음 자막을 JSON으로 구성해줘."
  },
  {
    id: "skill5",
    layer: "Layer 05",
    isNew: true,
    category: "AI 스킬",
    color: "sun",
    title: "손글씨·이미지 기반 커스텀 폰트 제작기",
    desc: "직접 쓴 손글씨나 AI가 생성한 레터링 이미지를 벡터 글리프로 변환하여 PC에 즉시 설치 가능한 TTF/WOFF2 폰트로 패키징합니다.",
    repoUrl: "https://github.com/ssaengcho01/ssaengcho/tree/main/image-to-fonts",
    promptPreview: "첨부된 글자 이미지들의 외곽선을 SVG 패스로 추출하고 opentype.js로 폰트 파일을 빌드해줘."
  },
  {
    id: "skill4",
    layer: "Layer 04",
    isNew: true,
    category: "AI 스킬",
    color: "sun",
    title: "영상 스토리보드 & 샷 플래너 스킬",
    desc: "시놉시스 한 줄을 입력하면 카메라 앵글, 조명, 피사체 움직임, 프롬프트까지 씬별(Scene)로 완벽히 구조화된 표와 샷 목록을 생성합니다.",
    repoUrl: "https://github.com/ssaengcho01/ssaengcho/tree/main/video-storyboard",
    promptPreview: "이 시놉시스로 15초 릴스용 6개 컷 스토리보드를 Midjourney 프롬프트와 함께 표로 정리해줘."
  },
  {
    id: "skill3",
    layer: "Layer 03",
    isNew: true,
    category: "AI 스킬",
    color: "sun",
    title: "화면 녹화 줌(Zoom) & 클릭 강조 편집 스킬",
    desc: "튜토리얼 강의 영상에서 마우스 클릭 위치에 빨간 펄스 박스를 표시하고 중요 입력창으로 자동 확대되는 CSS/Canvas 코드를 만듭니다.",
    repoUrl: "https://github.com/ssaengcho01/ssaengcho/tree/main/zoom-in-screen",
    promptPreview: "스크린 녹화 타임스탬프를 받아 마우스 클릭 좌표를 하이라이트하고 부드럽게 줌인하는 Remotion 컴포넌트를 만들어줘."
  },
  {
    id: "skill2",
    layer: "Layer 02",
    isNew: true,
    category: "AI 스킬",
    color: "sun",
    title: "회화 질감 2.5D 인터랙티브 애니메이션",
    desc: "정적인 그림 이미지를 Three.js 셰이더와 뎁스맵(Depth Map)을 사용해 마우스 시선에 따라 살아 움직이는 2.5D 유화 애니메이션으로 변환합니다.",
    repoUrl: "https://github.com/ssaengcho01/ssaengcho/tree/main/painterly-animation",
    promptPreview: "제공된 이미지와 뎁스맵으로 마우스 시차 효과(Parallax)와 수채화 셰이더를 적용한 HTML 페이지를 작성해줘."
  },
  {
    id: "skill1",
    layer: "Layer 01",
    isNew: false,
    category: "AI 스킬",
    color: "sun",
    title: "스톱모션 콜라주 영상 레시피 스킬",
    desc: "부드러운 영상을 12fps 아날로그 스톱모션 프레임으로 쪼개고 종이 찢김 텍스처와 빈티지 필터를 얹어 트렌디한 아트 필름으로 재가공합니다.",
    repoUrl: "https://github.com/ssaengcho01/ssaengcho/tree/main/stopmotion-collage-edit",
    promptPreview: "HTML5 Canvas를 사용해 비디오를 12프레임 스톱모션으로 렌더링하고 종이 질감 마스크를 씌워줘."
  }
];

export const makesData = [
  {
    id: "make10",
    layer: "Layer 10",
    isNew: true,
    category: "도구/웹앱",
    color: "sky",
    title: "EmoGIF Picker (이모지 & GIF 추천기)",
    desc: "문맥에 딱 맞는 감성 이모지와 짤(GIF)을 원클릭으로 찾아주는 소셜 미디어 크리에이터용 카피 보조 도구.",
    link: "https://github.com/ssaengcho01/emogif-picker",
    icon: "🎯",
    tech: ["Web API", "Clipboard", "Giphy API"]
  },
  {
    id: "make9",
    layer: "Layer 09",
    isNew: true,
    category: "도구/웹앱",
    color: "sky",
    title: "에지모 · AI 지원사업 모아보기",
    desc: "스타트업 및 예비 창업자를 위한 국내 AI 관련 정부 지원사업, 바우처 공고를 조건별로 실시간 탐색하는 대시보드.",
    link: "https://ajimo.soldaeng-guri.chatgpt.site/#explore",
    icon: "💼",
    tech: ["공공데이터", "실시간검색", "필터링"]
  },
  {
    id: "make8",
    layer: "Layer 08",
    isNew: true,
    category: "도구/웹앱",
    color: "sky",
    title: "내 폰트 다 모여 (PC 로컬 폰트 뷰어)",
    desc: "내 컴퓨터에 설치된 수백 개 폰트를 웹 브라우저에서 내 문구로 직접 입력해 실시간 비교하고 즐겨찾기하는 웹 유틸리티.",
    link: "https://font-moa.soldaeng-guri.chatgpt.site/",
    icon: "🔤",
    tech: ["Local Font Access API", "Canvas", "오프라인지원"]
  },
  {
    id: "make6",
    layer: "Layer 06",
    isNew: false,
    category: "도구/웹앱",
    color: "sky",
    title: "Brain Map · AI 아이디어 마인드맵",
    desc: "생각나는 아이디어를 한 줄 적으면 AI가 하위 기획안을 가지치기하며 인터랙티브 노드 맵으로 시각화해주는 브레인스토밍 캔버스.",
    link: "https://brainmap.soldaeng-guri.chatgpt.site/",
    icon: "🧠",
    tech: ["Node Graph", "SVG Wire", "OpenAI API"]
  },
  {
    id: "make2",
    layer: "Layer 02",
    isNew: true,
    category: "도구/웹앱",
    color: "sky",
    title: "에디공 · AI 디자인 공모전 캘린더",
    desc: "상금, 마감일, AI 툴 사용 허용 조건이 한눈에 정리된 전국의 크리에이티브 디자인 공모전 큐레이션 서비스.",
    link: "https://adigong.soldaeng-guri.chatgpt.site/",
    icon: "🏆",
    tech: ["Calendar UI", "카테고리필터", "알림"]
  },
  {
    id: "make7",
    layer: "Layer 07",
    isNew: false,
    category: "학습/튜토리얼",
    color: "sun",
    title: "Motion Prompt · 모션 용어 사전",
    desc: "이징, 블러, 쉐이크, 디졸브 등 36가지 모션 그래픽 효과의 실제 움직임을 눈으로 보고 복사하는 프롬프트 백과사전.",
    link: "https://motion-prompt-ssaengcho.soldaeng-guri.chatgpt.site/",
    icon: "📖",
    tech: ["CSS 애니메이션", "프롬프트복사", "비교뷰"]
  },
  {
    id: "make5",
    layer: "Layer 05",
    isNew: false,
    category: "게임/인터랙션",
    color: "tang",
    title: "밤탱이 조아시러 미니 아케이드 게임",
    desc: "30초 동안 하늘에서 떨어지는 간식을 캐치하고 장애물을 피하는 순발력 인터랙티브 웹 캐주얼 게임.",
    link: "https://bamtaeng.soldaeng-guri.chatgpt.site/",
    icon: "🎮",
    tech: ["HTML5 캔버스", "물리엔진", "오디오효과"]
  },
  {
    id: "make4",
    layer: "Layer 04",
    isNew: true,
    category: "메타버스/3D",
    color: "grape",
    title: "경복궁 로드스터 3D 가상 드라이빙",
    desc: "광화문 광장에서 경복궁 돌담길까지 멋진 스포츠카를 운전하며 즐기는 초경량 WebGL 3D 드라이빙 익스피리언스.",
    link: "https://gta-gung.soldaeng-guri.chatgpt.site/",
    icon: "🏎️",
    tech: ["Three.js", "WebGL", "주행물리"]
  },
  {
    id: "make1",
    layer: "Layer 01",
    isNew: false,
    category: "메타버스/3D",
    color: "grape",
    title: "명도 버추얼 아트 갤러리",
    desc: "웹 브라우저에서 방향키로 걸어 다니며 AI 아트워크를 감상하고 방명록을 남길 수 있는 3D 가상 전시 공간.",
    link: "https://ssaengdoongi-creators-1031.soldaeng-guri.chatgpt.site/gallery/",
    icon: "🏛️",
    tech: ["Three.js", "포인터락컨트롤", "오디오도슨트"]
  }
];

export const pressList = [
  {
    id: "press-1",
    badge: "한국경제",
    badgeColor: "tang",
    title: "15년 차 베테랑 디자이너도 'AI 크리에이터'로 전향한 이유",
    desc: "“코딩을 외우지 않아도 AI와 대화하며 나만의 앱을 만드는 시대가 열렸습니다.”",
    link: "https://www.hankyung.com/article/2026051591497"
  },
  {
    id: "press-2",
    badge: "Careet",
    badgeColor: "sky",
    title: "비개발자도 AI 바이브 코딩으로 나만의 서비스를 출시할 수 있을까?",
    desc: "상상을 바로 프로토타입으로 실현하는 1인 연구소의 생생한 개발기와 팁 인터뷰",
    link: "https://www.careet.net/Content/Secret/260310-9820cd02-dccc-4abb-bcce-be9281699000"
  }
];

