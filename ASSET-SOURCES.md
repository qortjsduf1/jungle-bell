# 리액션 이미지 출처

win/lose는 동물 기준입니다. 사용자가 이기면 lose 이미지가 표시됩니다.
웹 검색 날짜: 2026-10-16. 웹에서 발견한 짤의 원 저작자 및 재배포 허락 여부는 확인되지 않았으며, 아래 링크는 라이선스 부여를 뜻하지 않습니다.

| 파일 | 이미지 내용 | 출처 |
|---|---|---|
| chicken-win.png | 춤추는 닭 | 사용자가 첨부한 이미지 1 |
| cat-win.png | 능청스러운 고양이 | 사용자가 첨부한 이미지 2. 화면에서 사진 부분을 CSS로 표시 |
| cat-lose.png | 당황한 고양이 | 사용자가 첨부한 이미지 3 |
| chicken-lose.jpg | 거울을 보는 시무룩한 닭 | [Pinterest](https://co.pinterest.com/pin/820569994610203713/) |
| goat-win.jpg | 눈을 감고 웃는 염소 | [Pinterest](https://in.pinterest.com/pin/509047564113542707/) |
| goat-lose.jpg | 고개를 떨군 염소 | [Imgflip Sad Goat](https://imgflip.com/memetemplate/79529635/Sad-Goat) |
| horse-win.jpg | 이를 드러내며 웃는 말 | [Imgflip horse templates](https://imgflip.com/memesearch?page=3&q=horse) |
| horse-lose.png | 비를 맞는 풀이 죽은 말 | [Tenor Horse Sad](https://tenor.com/view/horse-sad-gif-15059883380218004312) |
| elephant-win.jpg | 혀를 내민 코끼리 | [Pinterest](https://www.pinterest.com/pin/playful-elephant-sticking-out-tongue--70437479835781/) — 사진 내 AWF 크레딧 유지 |
| elephant-lose.jpeg | 기둥 뒤로 숨은 코끼리 | [Memedroid elephant](https://www.memedroid.com/memes/tag/elephant) |

이미지는 `assets/reactions/`에 저장해 실행 중 외부 이미지 링크에 의존하지 않습니다. 연결 정보와 대사는 `app.js`의 `reactions` 배열에서 교체할 수 있습니다. 사진 로딩 실패 시 동물 이모지와 대사로 대체됩니다.

## 동물 음원

- `assets/audio/rooster.ogg`, `rooster.wav`: [Rooster crowing](https://commons.wikimedia.org/wiki/File:Rooster_crowing.ogg), Filo gèn’, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). OGG 원본, WAV 변환본. 런타임에서 속도·길이·볼륨 변경. 변환 및 편집 음원도 CC BY-SA 4.0.
- `assets/audio/cat.ogg`, `cat.wav`: [Meow](https://commons.wikimedia.org/wiki/File:Meow.ogg), Dan Crosby (Dcrosby), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). OGG 원본, WAV 변환본. 런타임에서 속도·반복·볼륨 변경. 변환 및 편집 음원도 CC BY-SA 3.0.
- 염소·말·코끼리 반응음과 놀리는 멜로디는 자체 합성.
