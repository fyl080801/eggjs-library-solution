const { JRender, Vue } = window

JRender &&
  Vue &&
  JRender.useGlobalRender(({ addComponent }) => {
    const cmp = Vue.component('test-component', {
      template: `<div>
            <h2>subtitle</h2>
            <p>ok</p>
        </div>`,
    })

    addComponent(cmp.name, cmp)
  })
