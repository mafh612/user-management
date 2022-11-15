const subscriptions: ((err: Response) => void)[] = []

export const publishError = async (err: Response) => {
  subscriptions.forEach(async (it) => it(err))
}
export const subscribeToErrors = (handleErrorFn: (err: Response) => void) => {
  subscriptions.push(handleErrorFn)
}
