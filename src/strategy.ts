export interface IStyle {
  getVariableObject(body: string): {
    [key: string]: string;
  }
  conver(text: string): string
}

export interface IStrategy {
  scss: IStyle;
  less: IStyle;
}

class Style {
  constructor() {}
  converVariableToObject(body:string, reg: RegExp) {
    const variableArray = body.match(reg)!;
    return variableArray.reduce((prev: { [key: string]: string }, variable) => {
      const splitArray = variable.split(':');
      if (splitArray.length === 2) {
        prev[splitArray[0].trim()] = splitArray[1].trim().slice(0, -1)
      }
      return prev
    }, {})
  }
}

export class Scss extends Style implements IStyle {
  private singleReg: RegExp
  private inputReg: RegExp
  constructor() {
    super()
    this.singleReg = /^\$.*?;/gm
    this.inputReg = /:\s*([^@|$]*)(.*)/
  }
  getVariableObject(body: string) {
    return super.converVariableToObject(body, this.singleReg)
  }
  conver(text: string) {
    let match = this.inputReg.exec(text)
    if (!match) return '';
    return match[1].trim()
  }
}

export class Less extends Style implements IStyle {
  private singleReg: RegExp
  private inputReg: RegExp
  constructor() {
    super()
    this.singleReg = /^@.*?;/gm
    this.inputReg = /:\s*([^@|$]*)(.*)/
  }
  getVariableObject(body: string) {
    return super.converVariableToObject(body, this.singleReg)
  }
  conver(text: string) {
    let match = this.inputReg.exec(text)
    if (!match) return '';
    return match[1].trim()
  }
}

const scss = new Scss()
const less = new Less()

export default { scss, less } as IStrategy