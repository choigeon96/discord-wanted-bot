# discord-wanted-bot

원티드 신규 채용공고 알림 봇
<br/>
<img width="486" alt="image" src="https://user-images.githubusercontent.com/71205245/169659646-e27fee29-7c06-4069-9fcd-7f487867e778.png">

to-do

- discord.js 연동
  - 채널에 봇 추가
  - 연동된 채널별 메세지 큐 생성
- 공고 중복 확인 방식 변경
  - 마지막으로 확인한 공고의 id를 캐시에 저장
    - id를 통해 중복 확인이 가능한지 확인
  - 공고 id를 기준으로 중복 여부 확인
  - 공고를 재등록하거나 수정한 경우엔???????
- 키워드 구독 기능 구현
  - discord 명령어를 통해 키워드 구독 정보 입력받기
    - /wanted subscribe [keyword]
  - 키워드 구독 시 구독 정보를 Postgres에 저장
  - 신규 공고 등록 시 공고 내용에 키워드가 포함되어 있으면 해당 공고를 Queue에 등록
  - 큐에 있는 공고 채널 메세지로 전송
    - 메세지에 구독자 멘션

    ```
    @username [keyword] 채용 공고가 등록되었습니다!
    공고 바로가기
    회사명
    ooo
    포지션
    ooo
    위치
    ooo
    ```
