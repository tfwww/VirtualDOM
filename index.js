let state = { num: 5 };
let timer;
let preVDom;

function render(element) {
  // 初始化的VD
  const vdom = view();
  preVDom = vdom;
  element.appendChild(dom);

  timer = setInterval(() => {
    state.num += 1;
    tick(element);
  }, 500);
}

function tick(element) {
  if (state.num > 20) {
    clearTimeout(timer);
    return;
  }

  const newVDom = view();
}

function view() {
  return (
    <div>
      Hello World
      <ul>
        {
          // 生成元素为0到n-1的数组
          [...Array(state.num).keys()].map((i) => (
            <li id={i} class={`li-${i}`}>
              第{i * state.num}
            </li>
          ))
        }
      </ul>
    </div>
  );
}
