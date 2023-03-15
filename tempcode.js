let tokens = {}
  
let mytokens = {
  animation: {
    delay: {},
    direction: {},
    duration: {},
    fillMode: {},

  },
  aspectRatio: {},
  border: {
    style: {},
  },
  color: {},
  dimension: {},
  easings: {
    cubicBezier: {}
  },
  files: {},
  filter: {},
  gradient: {
    conic: {},
    linear: {},
    radial: {},
  },
  other: {},
  shadow: {},
  shape: {},
  size: {},
  typography: {
    fontFamily: {},
    fontSize: {},
    fontWeight: {},
  },
}
const camel2title = (camelCase) => camelCase
.replace(/([A-Z])/g, (match) => ` ${match}`)
.replace(/^./, (match) => match.toUpperCase())
.trim();

const uuidv4 = () => ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
const findToken = (group, id) => tokens[group].find(entry => entry.id === id)
const findTokenIndex = (group, id) => tokens[group].findIndex(entry => entry.id === id)

function renderTokens(tokens) {
tokenlist.innerHTML = Object.keys(tokens)
  .map(
    (group) => `<details open><summary>${camel2title(group)}</summary>${
      tokens[group]
        ? `<table><thead><tr><th>Key</th><th>Description</th><th>Value</th><th>Actions</th></tr></thead>`
        : ''
    }
  ${Object.keys(tokens[group])
    .map(
      (key, value) => `<tr><td>${key}</td><td>${value.description||''}</td><td${group === 'color'?` style="background-color:${tokens[group][key].value};"`:''}>${
        tokens[group][key].value
      }</td>
    <td><button type="button" name="edit" data-group="${group}" data-uuid="${
        key
      }">Edit</button>
    ${
      value.deletable
        ? `<button type="button" name="delete" data-group="${group}" data-uuid="${entry.id}">Delete</button>`
        : ''
    }
    </td></tr>`
    )
    .join('')}
    ${tokens[group].length ? `</table>` : ''}</details>`
  )
  .join('');
}

const localTokens = localStorage.getItem('tokens');
if (localTokens) tokens = Object.assign(tokens, JSON.parse(localTokens));
// renderTokens()

app.addEventListener('submit', (event) => {
  event.preventDefault()
  if (app.elements.uuid.value) {
    /* update */
    const obj = findToken(app.elements.group.value, app.elements.uuid.value)
    if (obj) {
      obj.key = app.elements.key.value
      obj.name = app.elements.name.value
      obj.value = app.elements.value.value
    }
  }
  else {
    /* add */
    tokens[app.elements.group.value].push(
    {
      deletable: true,
      id: uuidv4(),
      key: app.elements.key.value,
      name: app.elements.name.value,
      value: app.elements.value.value
    })
  }
 
  localStorage.setItem('tokens', JSON.stringify(tokens))
  renderTokens();
  app.reset();
})


function importTokens(tokens) {
  Object.keys(tokens).forEach(key => {
    const token = tokens[key];
    if (token.type && TOKENS[token.type]) {
      TOKENS[token.type][key] = { value: token.value }
    }
  })
  // renderTokens(TOKENS)
  console.log(TOKENS)
}
tokenlist.addEventListener('click', event => {
    const node = event.target;
    if (node.tagName === 'BUTTON') {
      switch(node.name) {
        case 'edit': {
          const obj = findToken(node.dataset.group, node.dataset.uuid)
          if (obj) {
            app.elements.uuid.value = obj.id,
            app.elements.key.value = obj.key,
            app.elements.name.value = obj.name,
            app.elements.value.value = obj.value,
            app.elements.group.value = node.dataset.group
          }
        }
        break;
        case 'delete': {
          if (confirm('Delete token?')) {
            const index = findTokenIndex(node.dataset.group, node.dataset.uuid)
            delete tokens[node.dataset.group][index]
          }

          // localStorage.setItem('tokens', JSON.stringify(tokens))
          renderTokens();
          // app.reset();
        }
        break;
      }
    }
  })

	/*

	  <!--https://developer.mozilla.org/en-US/docs/Web/CSS/Reference-->
  <!--https://utopia.fyi/
	angle
  deg
  grad
  rad
  turn
  %

  basic-shape
    circle
    ellipse
    inset
    path
    polygon

blend-mode
color
counter
dimension = number + unit
frequency
gradient
ident = https://developer.mozilla.org/en-US/docs/Web/CSS/ident
image (url)
integer
length
number
percentage
	*/