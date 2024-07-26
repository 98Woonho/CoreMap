WEB PROJECT PLANING
=

## ▶️ 개발 동기
##### 운동시설 및 운동 컨텐츠의 접근성이 높아짐에 따라 운동에 관심을 가지는 사람들이 증가 하고 있음. 그래서 운동 자세를 알려주고, 게시판을 통해 다른 사람들과 정보 공유 및 질문을 나눌 수 있는 사이트를 구현해보자 생각했음.

## ▶️ 개발 목표
##### 여러 운동 자세 정보 및 게시판이 있는 사이트 만들기

<br/>

## ▶️ 개발 일정
#### 2024-02-07 ~ 2024-02-08(02Days) : 주제 선정 및 요구사항 분석, 기술스택 결정, 개발환경 구축
#### 2024-02-08 ~ 2024-02-09(02Days) : 기본 프론트엔드 구조 기획 및 개발, DB 기획 및 개발
#### 2024-02-09 ~ 2024-02-28(20Days) : 프론트엔드 및 백엔드 개발

<br/>

## ▶️ ERD
![coremap ERD](https://github.com/98Woonho/Coremap/assets/145889732/66ba81b6-74fb-49f9-8fb6-ade9b257cab3)

<br/>

## ▶️ 시연 영상
https://www.youtube.com/watch?v=AOuMxil_MPQ

<br/>

## ▶️ 개발 환경
##### IDE : IntelliJ Ultimate
##### OpenJDK 21
##### Java21
##### SpringBoot 3.1.7
##### gradle
##### Mysql Server
##### Mysql Workbench
##### Connection Pool : HikariCP

<br/>

## ▶️ 사용 API
##### 다음 주소 API
##### OAuth2 로그인 API

<br/>

## ▶️ 기술스택

![JAVA](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=Java&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![MySQL](https://img.shields.io/badge/Mysql-4479A1?style=for-the-badge&logo=Mysql&logoColor=white)
![Spring](https://img.shields.io/badge/Spring-6DB33F?style=for-the-badge&logo=Spring&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white)
![BootStrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Github](https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white)

<br/>

## ▶️ 주요 기능
##### JWT 기반 로그인 및 회원가입
##### 게시판, 비동기 댓글
##### 사용자/관리자 페이지
##### 운동 자세 설명

📃: File Tree
---
```
Coremap

C:.
└─ src
   ├─ main
   │  ├─ java
   │  │  └─ com
   │  │     └─ coremap
   │  │        └─ demo
   │  │           ├─ config
   │  │           │  ├─ auth
   │  │           │  │  ├─ exceptionHandler
   │  │           │  │  │  ├─ CustomAccessDeniedHandler.java
   │  │           │  │  │  └─ CustomAuthenticationEntryPoint.java
   │  │           │  │  ├─ jwt
   │  │           │  │  │  ├─ JwtAuthenticationFilter.java
   │  │           │  │  │  ├─ JwtAuthorizationFilter.java
   │  │           │  │  │  ├─ JwtProperties.java
   │  │           │  │  │  ├─ JwtTokenProvider.java
   │  │           │  │  │  ├─ KeyGenerator.java
   │  │           │  │  │  └─ TokenInfo.java
   │  │           │  │  ├─ loginHandler
   │  │           │  │  │  ├─ CustomAuthenticationFailureHandler.java
   │  │           │  │  │  ├─ CustomLoginSuccessHandler.java
   │  │           │  │  │  └─ Oauth2JwtLoginSuccessHandler.java
   │  │           │  │  ├─ logoutHandler
   │  │           │  │  │  ├─ CustomLogoutHandler.java
   │  │           │  │  │  └─ CustomLogoutSuccessHandler.java
   │  │           │  │  ├─ PrincipalDetails.java
   │  │           │  │  ├─ PrincipalDetailsOAuth2Service.java
   │  │           │  │  ├─ PrincipalDetailsService.java
   │  │           │  │  └─ provider
   │  │           │  │     ├─ GoogleUserInfo.java
   │  │           │  │     ├─ KakaoUserInfo.java
   │  │           │  │     ├─ NaverUserInfo.java
   │  │           │  │     └─ OAuth2UserInfo.java
   │  │           │  ├─ DataSourceConfig.java
   │  │           │  ├─ MultipartConfig.java
   │  │           │  ├─ SecurityConfig.java
   │  │           │  ├─ TxConfig.java
   │  │           │  └─ WebMvcConfig.java
   │  │           ├─ controller
   │  │           │  ├─ adminController.java
   │  │           │  ├─ ArticleController.java
   │  │           │  ├─ BoardController.java
   │  │           │  ├─ ControllerAdvice.java
   │  │           │  ├─ HomeController.java
   │  │           │  ├─ PolicyContainer.java
   │  │           │  └─ UserController.java
   │  │           ├─ DemoApplication.java
   │  │           ├─ domain
   │  │           │  ├─ dto
   │  │           │  │  ├─ ArticleDto.java
   │  │           │  │  ├─ CertificationDto.java
   │  │           │  │  ├─ CommentDto.java
   │  │           │  │  ├─ CommentLikeDto.java
   │  │           │  │  ├─ EmailAuthDto.java
   │  │           │  │  ├─ FileDto.java
   │  │           │  │  ├─ ImageDto.java
   │  │           │  │  └─ UserDto.java
   │  │           │  ├─ entity
   │  │           │  │  ├─ Article.java
   │  │           │  │  ├─ Board.java
   │  │           │  │  ├─ Comment.java
   │  │           │  │  ├─ CommentLike.java
   │  │           │  │  ├─ CommentLikeId.java
   │  │           │  │  ├─ ContactCompany.java
   │  │           │  │  ├─ EmailAuth.java
   │  │           │  │  ├─ EmailAuthId.java
   │  │           │  │  ├─ Exercise.java
   │  │           │  │  ├─ File.java
   │  │           │  │  ├─ Image.java
   │  │           │  │  ├─ Signature.java
   │  │           │  │  └─ User.java
   │  │           │  ├─ repository
   │  │           │  │  ├─ ArticleRepository.java
   │  │           │  │  ├─ BoardRepository.java
   │  │           │  │  ├─ CommentLikeRepository.java
   │  │           │  │  ├─ CommentRepository.java
   │  │           │  │  ├─ ContactCompanyRepository.java
   │  │           │  │  ├─ EmailAuthRepository.java
   │  │           │  │  ├─ ExerciseRepository.java
   │  │           │  │  ├─ FileRepository.java
   │  │           │  │  ├─ ImageRepository.java
   │  │           │  │  └─ UserRepository.java
   │  │           │  └─ vo
   │  │           │     ├─ PageVo.java
   │  │           │     └─ SearchVo.java
   │  │           ├─ properties
   │  │           │  └─ EmailAuthProperties.java
   │  │           ├─ regexes
   │  │           │  ├─ CommentRegex.java
   │  │           │  ├─ EmailAuthRegex.java
   │  │           │  ├─ Regex.java
   │  │           │  └─ UserRegex.java
   │  │           ├─ service
   │  │           │  ├─ ArticleService.java
   │  │           │  ├─ BoardService.java
   │  │           │  ├─ HomeService.java
   │  │           │  └─ UserService.java
   │  │           └─ utils
   │  │              └─ CryptoUtil.java
   │  └─ resources
   │     ├─ application.properties
   │     ├─ static
   │     │  ├─ css
   │     │  │  ├─ admin
   │     │  │  │  └─ adminPage.css
   │     │  │  ├─ article
   │     │  │  │  ├─ ckeditor.css
   │     │  │  │  ├─ modify.css
   │     │  │  │  ├─ read.css
   │     │  │  │  └─ write.css
   │     │  │  ├─ board
   │     │  │  │  └─ list.css
   │     │  │  ├─ common.css
   │     │  │  ├─ exerciseGuide.css
   │     │  │  ├─ index.css
   │     │  │  ├─ policy
   │     │  │  │  ├─ privacyPolicy.css
   │     │  │  │  └─ terms.css
   │     │  │  └─ user
   │     │  │     ├─ additionalInfo.css
   │     │  │     ├─ findEmail.css
   │     │  │     ├─ findEmailResult.css
   │     │  │     ├─ join.css
   │     │  │     ├─ login.css
   │     │  │     ├─ myPage.css
   │     │  │     ├─ resetPasswordStep1.css
   │     │  │     ├─ resetPasswordStep2.css
   │     │  │     └─ secessionCompletion.css
   │     │  ├─ images
   │     │  │  ├─ article
   │     │  │  │  └─ read.file.icon.png
   │     │  │  ├─ comment
   │     │  │  │  ├─ vote.down.png
   │     │  │  │  └─ vote.up.png
   │     │  │  ├─ login
   │     │  │  │  ├─ google.png
   │     │  │  │  ├─ kakao.png
   │     │  │  │  └─ naver.png
   │     │  │  ├─ mainSection1Background.jpg
   │     │  │  ├─ mainSection2Image1.png
   │     │  │  └─ mainSection3Image1.png
   │     │  └─ js
   │     │     ├─ article
   │     │     │  ├─ ckeditor
   │     │     │  │  ├─ ckeditor.js
   │     │     │  │  ├─ ckeditor.js.map
   │     │     │  │  └─ translations
   │     │     │  │     ├─ af.js
   │     │     │  │     ├─ ar.js
   │     │     │  │     ├─ ast.js
   │     │     │  │     ├─ az.js
   │     │     │  │     ├─ bg.js
   │     │     │  │     ├─ bn.js
   │     │     │  │     ├─ bs.js
   │     │     │  │     ├─ ca.js
   │     │     │  │     ├─ cs.js
   │     │     │  │     ├─ da.js
   │     │     │  │     ├─ de-ch.js
   │     │     │  │     ├─ de.js
   │     │     │  │     ├─ el.js
   │     │     │  │     ├─ en-au.js
   │     │     │  │     ├─ en-gb.js
   │     │     │  │     ├─ en.js
   │     │     │  │     ├─ eo.js
   │     │     │  │     ├─ es-co.js
   │     │     │  │     ├─ es.js
   │     │     │  │     ├─ et.js
   │     │     │  │     ├─ eu.js
   │     │     │  │     ├─ fa.js
   │     │     │  │     ├─ fi.js
   │     │     │  │     ├─ fr.js
   │     │     │  │     ├─ gl.js
   │     │     │  │     ├─ gu.js
   │     │     │  │     ├─ he.js
   │     │     │  │     ├─ hi.js
   │     │     │  │     ├─ hr.js
   │     │     │  │     ├─ hu.js
   │     │     │  │     ├─ hy.js
   │     │     │  │     ├─ id.js
   │     │     │  │     ├─ it.js
   │     │     │  │     ├─ ja.js
   │     │     │  │     ├─ jv.js
   │     │     │  │     ├─ km.js
   │     │     │  │     ├─ kn.js
   │     │     │  │     ├─ ku.js
   │     │     │  │     ├─ lt.js
   │     │     │  │     ├─ lv.js
   │     │     │  │     ├─ ms.js
   │     │     │  │     ├─ nb.js
   │     │     │  │     ├─ ne.js
   │     │     │  │     ├─ nl.js
   │     │     │  │     ├─ no.js
   │     │     │  │     ├─ oc.js
   │     │     │  │     ├─ pl.js
   │     │     │  │     ├─ pt-br.js
   │     │     │  │     ├─ pt.js
   │     │     │  │     ├─ ro.js
   │     │     │  │     ├─ ru.js
   │     │     │  │     ├─ si.js
   │     │     │  │     ├─ sk.js
   │     │     │  │     ├─ sl.js
   │     │     │  │     ├─ sq.js
   │     │     │  │     ├─ sr-latn.js
   │     │     │  │     ├─ sr.js
   │     │     │  │     ├─ sv.js
   │     │     │  │     ├─ th.js
   │     │     │  │     ├─ tk.js
   │     │     │  │     ├─ tr.js
   │     │     │  │     ├─ tt.js
   │     │     │  │     ├─ ug.js
   │     │     │  │     ├─ uk.js
   │     │     │  │     ├─ ur.js
   │     │     │  │     ├─ uz.js
   │     │     │  │     ├─ vi.js
   │     │     │  │     ├─ zh-cn.js
   │     │     │  │     └─ zh.js
   │     │     │  ├─ modify.js
   │     │     │  ├─ read.js
   │     │     │  └─ write.js
   │     │     ├─ board
   │     │     │  └─ list.js
   │     │     ├─ common.js
   │     │     ├─ index.js
   │     │     ├─ policy
   │     │     │  ├─ privacyPolicy.js
   │     │     │  └─ terms.js
   │     │     └─ user
   │     │        ├─ additionalInfo.js
   │     │        ├─ findEmail.js
   │     │        ├─ join.js
   │     │        ├─ myPage.js
   │     │        ├─ resetPasswordStep1.js
   │     │        └─ resetPasswordStep2.js
   │     └─ templates
   │        ├─ admin
   │        │  └─ adminPage.html
   │        ├─ article
   │        │  ├─ modify.html
   │        │  ├─ read.html
   │        │  └─ write.html
   │        ├─ board
   │        │  └─ list.html
   │        ├─ exerciseGuide.html
   │        ├─ fragments
   │        │  └─ fragments.html
   │        ├─ index.html
   │        ├─ policy
   │        │  ├─ privacyPolicy.html
   │        │  └─ terms.html
   │        └─ user
   │           ├─ additionalInfo.html
   │           ├─ findEmail.html
   │           ├─ findEmailResult.html
   │           ├─ join.html
   │           ├─ joinEmail.html
   │           ├─ login.html
   │           ├─ myPage.html
   │           ├─ resetPasswordEmail.html
   │           ├─ resetPasswordStep1.html
   │           ├─ resetPasswordStep2.html
   │           └─ secessionCompletion.html
   └─ test
      └─ java
         └─ com
            └─ coremap
               └─ demo
                  └─ DemoApplicationTests.java

```