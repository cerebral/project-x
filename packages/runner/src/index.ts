

class ComposedSequence {
  setPRops
  action<ActionResult, ActionPaths>(
    callback: (context: { props: Props, path: ActionPaths }) => ActionResult,
    path?: ActionPaths
  ) {
    const actionResult = callback({ props: this.props, path })

    return new Sequence<Props & ActionResult>(Object.assign(actionResult, this.props))
  }
  sequence(execute: (props: Props) => ComposedSequence) {
    return execute(this.props)
  }
}

class Sequence<Props> {
  props: Props
  constructor (props: Props) {
    this.props = props
  }
  action<ActionResult, ActionPaths>(
    callback: (context: { props: Props, path: ActionPaths }) => ActionResult,
    path?: ActionPaths
  ) {
    const actionResult = callback({ props: this.props, path })

    return new Sequence<Props & ActionResult>(Object.assign(actionResult, this.props))
  }
  sequence(execute: (props: Props) => ComposedSequence) {
    return execute(this.props)
  }
}

function sequence<Props>(callback: (sequence: Sequence<Props>) => Sequence<Props>): (props: Props) => Sequence<Props> {
  return function execute(props: Props) {
    return callback(new Sequence<Props>(props))
  }
}

type ActionContext = {
  props: {
    bar: number
  }
}

function mih ({ props }: ActionContext) {  
  return {}
}

function moh ({ props }: { props: { mip: string }}) {
  return {
    iLike: true
  }
}

type NewActionContext = {
  props: {
    bar: number
  },
  path: {
    success: (props: { mip: string }) => {},
    error: (props: { error: string }) => {}
  }
}

function withPaths ({ props, path }: NewActionContext) {
  if (props.bar === 123) {
    return path.error({
      error: 'bah!'
    })
  }

  return path.success({
    mip: 'string'
  })
}

function bah ({ props }: { props: { foo: string }}) {
  return {
    bar: 123
  }
}

const otherSequence = sequence<{ foo: string, bar: number}>(s => s.action(function hmmmm ({ props }) {
  return {
    bip: 'bop'
  }
}))

const execute = sequence<{ foo: string}>(s => s
  .action(bah)
  .action(mih)
  .sequence(otherSequence)
  .action(function bahaha ({ props }) {
  })
  .action(withPaths,  {
    success: sequence<{ mip: string}>(s => s
      .action(moh)
    ),
    error: sequence<{ error: string }>(s => s)
  })
  .action(function testers ({ props }) {
    return {}
  })
)

execute({
  foo: 'bar'
})