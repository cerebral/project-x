export type Props = {
  [key: string]: any
}

export type ActionResult = Props | void

export type ActionCallback = {
  (context: {}): ActionResult
}

export type Execution<ExecutionProps> {

}