# Hyperledger-Indy DID/SSI 신원인증 [ TAP ] 프로젝트 
<img width="500" alt="image" src="https://user-images.githubusercontent.com/66229916/98773064-80524100-242b-11eb-91ed-5ef833348303.png">


This is a Block-chain project which is coming up in these days as a DID. 

 Furthermore, our team focused on the common problem when they need to submit their ID card to buy some drinks. In my opinion, it couldn't limit just in Korea.
 For instance, in order to verify, you should show up your ID card which has quite sensitive information. As appear your information in a convenience store or Bar etc, not only you would able to verify your ID but also you could be exposed your highly sensitive information to a stranger.
 This exposure could cause another risky crime. 

 Our team wanted to tackle this huge social problem with Block-chain technology. 
Thus, we decided to use Hyperledger-Indy open project which is developed by Linux as a part of Block-chain DID project.

we made 2 Clients Applications with React-Native(Expo), and 1 Client virtual Government web-page in order to issue a mobile ID card.

we utilised Open source ( Hyperledger-Indy-SDK, Von-network).
Thus, for using these Apps, first of all, you need an environment for Indy. Moreover need to reset new block-chain sandbox test network and replace a block-chain genesis file address to a suitable one. (as block-chain network IP address) 



# TAP_BlockChain_Project

 DID/SSI project _ team 3  < with Hyperledger-Indy >
 
# 팀원
PM/PL 

 - 김요한

crews / Front-end

 - 이신애
 - 신은혜
 
 
 
# PROJECT simple flow 
  : TAP 
![service_flow](https://user-images.githubusercontent.com/66229916/98775452-872f8280-2430-11eb-83df-490fc9840348.png)


  
# Business aspect

 PROJECT Title_ 
  : 편의점 및 술집 등, 제품 판매시 미성년자 구분이 확실해야 하는 비즈니스를 대상으로 한 가상서비스 프로젝트. 
 
 PROJECT DETAILS
   - 언제 어디서든 간편히 QR 코드를 이용하여 TAP 한번으로 나의 블록체인을 이용하여 안전하게 모바일 신분증을 발급받고, 신분증으로 자신의 민감한 개인정보를 밝히지 않고도 성인 인증을 할 수있는 간편서비스.
   - 신분증을 발급받는 과정과, 나의 신원정보를 인증하는 과정은 블록체인을 이용하여 위변조가 불가능함과 동시에 암호화 된 상태로 지갑에 보관되는 신분증은 사용하는 사용자도, 신분증을 인증해야하는 기업(ex.  편의점 점
     주)도 신뢰하고 이용할 수 있음 
   - 블록체인 네트워크로 발급 받을 수 있는 모바일 신분증은, 자신의 개인 핸드폰에 발급받게 됨으로, 신분증 분실 등의 염려가 없으며, 언제든 핸드폰을 소지하고 다니는 시대상에 알맞게 신분증 소지의 편리함을 야기함.
 
 


# 프로젝트 details
   - Hyperledger-Indy open-source 를 이용한 블록체인 네트워크를 구성 (with Von-network) 
   - block-chain 네트워크는 docker를 이용하여 총 4개의 노드를 구성하여 네트워크를 구성하게 됨. open-source를 이용한 webserver가 트랜젝션 실시간 상황을 catch 할 수 있게 해줌.
   - Hyperledger-Indy open-source API (이번 프로젝트에서는 Node.js를 사용) 로 신원인증 전 과정 코드 작성 진행.
   - 신분증을 발급하고, 발급받고, 발급받은 신분증을 사용(=인증) 하는 과정을 모두 구현하기 위해 최소 총 3명의 가상 Clients 가 필요했기 때문에,
     Node.js(10.22.0)로 issuer(발급자), prover(사용자), verifier(증명자) 이렇게 총 3개의 서버를 구성하게 됨.
   - issuer(발급자) 는 모바일 신분증을 사용자에게 발급 해 줄 수 있는 가상의 '정부' 로 구성. node.js 서버와 정부 web 페이지를 구성하여 신분증을 발급하는 과정을 구현.
   - prover(사용자) 는 모바일 신분증을 정부로부터 핸드폰 DApp 에 발급받는 과정 및 사용하는 과정을 구현하기 위해 React-native(expo) 로 어플을 구현, Node.js 서버와 데이터를 주고받기 위해 REST API 
     를 적극활용.
   - verifier(증명자) 는 '가상의 편의점 점주, 술을 판매해야되는 음식점' 등 비즈니스적인 측면에서 사용자의 성인 여부를 확인해야 되는 상황에 놓인 사람이라 가정 후 개발함. 
     그렇기 때문에 verifier(증명자) 역시 간편하게 사용할 수 있는 DApp 이 필요하기때문에 이 역시 React-native(expo)로 어플을 구현, Node.js 서버와 데이터를 주고받기 위해 REST API를 적극 활용.
   - Database 는 SQLite3 를 이용함.
   - 시스템 환경은 vitual-box 에서 ubuntu18 위에 프로젝트를 구성함.
   

# System architecture
![system-architecture](https://user-images.githubusercontent.com/66229916/98773513-6d8c3c00-242c-11eb-9392-2a8b371bc295.png)


# 프로젝트 UI

![for_github 001](https://user-images.githubusercontent.com/66229916/98773924-42eeb300-242d-11eb-9ee4-bef08bc11a46.jpeg)
![for_github 002](https://user-images.githubusercontent.com/66229916/98773927-441fe000-242d-11eb-990c-03eb81dda6a0.jpeg)
![for_github 003](https://user-images.githubusercontent.com/66229916/98773929-44b87680-242d-11eb-8f44-9866dce12603.jpeg)
![for_github 004](https://user-images.githubusercontent.com/66229916/98773930-45510d00-242d-11eb-9fac-630768cf4075.jpeg)
![for_github 005](https://user-images.githubusercontent.com/66229916/98773932-45e9a380-242d-11eb-94f8-158a54beeced.jpeg)
![git_2 001](https://user-images.githubusercontent.com/66229916/98773934-45e9a380-242d-11eb-8ca0-88b80724fe3f.jpeg)
![git_2 002](https://user-images.githubusercontent.com/66229916/98773936-46823a00-242d-11eb-9492-cbd79df68195.jpeg)
![git_2 003](https://user-images.githubusercontent.com/66229916/98773938-46823a00-242d-11eb-8a44-c3b40d1e6567.jpeg)

   
 


