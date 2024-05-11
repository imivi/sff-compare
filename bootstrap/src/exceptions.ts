export class CustomError extends Error {
    constructor(message: string) {
        super(message)
        Object.setPrototypeOf(this, CustomError.prototype)
    }
}

export class ColumnMismatchError extends CustomError { }
export class MissingColumnError extends CustomError { }
export class MissingSheetError extends CustomError { }
