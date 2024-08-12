export default function DefaultScreen({ $target }) {
  const $defaultScreen = document.createElement("div");

  $defaultScreen.className = "defaultScreen";

  $target.appendChild($defaultScreen);

  this.setState = (nextState) => {
    this.state = nextState;
    $defaultScreen.className = this.state.isEditor ? "none" : "defaultScreen";
    this.render();
  };

  this.render = () => {
    $defaultScreen.innerHTML = `
    <div class="greetings">Vanila JS로 만든 노션 에디터입니다. 오늘도 좋은 하루 되세요! 🥰</div>
    <div class="usage-container">
    <div>
    <div class='bold'>1. 제목 입력 방법</div>
    <ul class='usage-ul'><li><span class='bold'>단계별 제목 만들기:</span> 문서의 제목을 설정할 때는 다음과 같이 입력하세요:</li></ul>
    <div class="usage">'# 제목' 이라고 입력한 후 저장하면, <h1>제목</h1> 으로 표시됩니다.</div>
    <div class="usage">'## 제목' 이라고 입력한 후 저장하면, <h2>제목</h2> 으로 표시됩니다.</div>
    <div class="usage">'### 제목' 이라고 입력한 후 저장하면, <h3>제목</h3> 으로 표시됩니다.</div>
    </div>
    <div>
    <div class='bold'>2. 리스트 입력 방법</div>
    <ul class='usage-ul'><li><span class='bold'>리스트 항목 만들기:</span> 목록을 만들고 싶다면, 다음과 같이 입력하세요:</li></ul>
    <div class="usage">'- 리스트1' 이라고 입력한 후 저장하면, <ul class="usage-ul"><li>리스트1</li></ul> 이라는 항목으로 표시됩니다.</div>
    </div>
    <div>
    <div class='bold'>3. 저장 단축키 안내</div>
    <ul class='usage-ul'><li><span class='bold'>문서 저장 방법:</span></li></ul>
    <div class="usage window">Window 사용자는 <span class="strong">control + s</span> 키를 눌러서 저장할 수 있습니다.</div>
    <div class="usage">Mac 사용자는 <span class="strong">command + s</span> 키를 눌러서 저장할 수 있습니다.</div>
    </div>
    </div>`;
  };
}
