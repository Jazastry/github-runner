export const bound =
    () =>
    (
        target: any,
        { name, kind, addInitializer }: ClassMethodDecoratorContext
    ) => {
        if (kind === 'method') {
            addInitializer(function () {
                this[name] = this[name].bind(this)
            })
        }

        return target
    }
