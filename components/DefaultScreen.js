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
    <div class="greetings">안녕하세요. 제 Notion에 오신 것을 환영합니다!</div>
    <div class="description">Vanila JS로 만든 노션 에디터입니다. 오늘도 좋은 하루 되세요! 🥰</div>
    `;
  };
}
